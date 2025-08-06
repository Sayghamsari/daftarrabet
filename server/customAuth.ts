import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { smsService } from "./smsService";
import type { User, LoginData, RegisterData, VerifyPhoneData, CompleteProfileData } from "@shared/schema";
import ConnectPgSimple from "connect-pg-simple";

declare global {
  namespace Express {
    interface User {
      id: string;
      nationalId: string;
      phoneNumber: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      role: string;
      schoolId?: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    }
    interface Session {
      tempPhoneNumber?: string;
      phoneVerified?: boolean;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupCustomAuth(app: Express) {
  const PostgresSessionStore = ConnectPgSimple(session);
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new PostgresSessionStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      tableName: 'session',
    }),
    cookie: {
      httpOnly: true,
      secure: false, // در توسعه false، در production true
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 هفته
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // استراتژی ورود با کد ملی و رمز عبور
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'nationalId',
        passwordField: 'password'
      },
      async (nationalId, password, done) => {
        try {
          if (!smsService.isValidNationalId(nationalId)) {
            return done(null, false, { message: 'کد ملی نامعتبر است' });
          }

          const user = await storage.getUserByNationalId(nationalId);
          if (!user) {
            return done(null, false, { message: 'کاربر یافت نشد' });
          }

          if (!user.isVerified) {
            return done(null, false, { message: 'شماره تلفن تایید نشده است' });
          }

          const isPasswordValid = await comparePasswords(password, user.password);
          if (!isPasswordValid) {
            return done(null, false, { message: 'رمز عبور اشتباه است' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // مرحله 1: ارسال کد تایید
  app.post("/api/auth/send-verification", async (req, res) => {
    try {
      const { phoneNumber }: RegisterData = req.body;

      if (!smsService.isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: "شماره تلفن نامعتبر است" });
      }

      // بررسی اینکه آیا کاربر قبلاً ثبت‌نام کرده
      const existingUser = await storage.getUserByPhoneNumber(phoneNumber);
      if (existingUser && existingUser.isVerified) {
        return res.status(400).json({ error: "این شماره تلفن قبلاً ثبت‌نام شده است" });
      }

      const code = smsService.generateVerificationCode();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 دقیقه

      await storage.createSmsVerification({
        phoneNumber,
        code,
        expiresAt,
      });

      const smsSent = await smsService.sendVerificationCode(phoneNumber, code);
      if (!smsSent) {
        return res.status(500).json({ error: "خطا در ارسال پیامک" });
      }

      res.json({ message: "کد تایید ارسال شد" });
    } catch (error) {
      console.error("Error sending verification:", error);
      res.status(500).json({ error: "خطای سرور" });
    }
  });

  // مرحله 2: تایید کد و ایجاد جلسه موقت
  app.post("/api/auth/verify-phone", async (req, res) => {
    try {
      const { phoneNumber, code }: VerifyPhoneData = req.body;

      const verification = await storage.getValidSmsVerification(phoneNumber, code);
      if (!verification) {
        return res.status(400).json({ error: "کد تایید نامعتبر یا منقضی شده است" });
      }

      await storage.markSmsVerificationAsUsed(verification.id);

      // ایجاد جلسه موقت
      req.session.tempPhoneNumber = phoneNumber;
      req.session.phoneVerified = true;

      res.json({ message: "شماره تلفن تایید شد", needsProfile: true });
    } catch (error) {
      console.error("Error verifying phone:", error);
      res.status(500).json({ error: "خطای سرور" });
    }
  });

  // مرحله 3: تکمیل پروفایل
  app.post("/api/auth/complete-profile", async (req, res) => {
    try {
      if (!req.session.phoneVerified || !req.session.tempPhoneNumber) {
        return res.status(400).json({ error: "شماره تلفن تایید نشده است" });
      }

      const { nationalId, firstName, lastName, email, role, schoolId }: CompleteProfileData = req.body;

      if (!smsService.isValidNationalId(nationalId)) {
        return res.status(400).json({ error: "کد ملی نامعتبر است" });
      }

      // بررسی تکراری نبودن کد ملی
      const existingUserByNationalId = await storage.getUserByNationalId(nationalId);
      if (existingUserByNationalId) {
        return res.status(400).json({ error: "این کد ملی قبلاً ثبت‌نام شده است" });
      }

      // رمز عبور = 4 رقم آخر کد ملی
      const password = nationalId.slice(-4);
      const hashedPassword = await hashPassword(password);

      const user = await storage.createUser({
        nationalId,
        phoneNumber: req.session.tempPhoneNumber,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        role,
        schoolId,
        isVerified: true,
      });

      // پاک کردن جلسه موقت
      delete req.session.tempPhoneNumber;
      delete req.session.phoneVerified;

      // ورود خودکار
      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ error: "خطا در ورود" });
        }
        res.json({ user, message: "ثبت‌نام با موفقیت انجام شد" });
      });
    } catch (error) {
      console.error("Error completing profile:", error);
      res.status(500).json({ error: "خطای سرور" });
    }
  });

  // ورود
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: User | false, info: any) => {
      if (err) {
        return res.status(500).json({ error: "خطای سرور" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "اطلاعات ورود نادرست است" });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "خطا در ورود" });
        }
        res.json({ user });
      });
    })(req, res, next);
  });

  // خروج
  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "خروج با موفقیت انجام شد" });
    });
  });

  // دریافت اطلاعات کاربر
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "کاربر وارد نشده است" });
    }
    res.json(req.user);
  });
}

// Middleware برای بررسی احراز هویت
export const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "دسترسی غیرمجاز" });
  }
  next();
};