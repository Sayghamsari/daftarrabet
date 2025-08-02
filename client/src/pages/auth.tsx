import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { 
  LoginData, 
  RegisterData, 
  VerifyPhoneData, 
  CompleteProfileData,
  loginSchema, 
  registerSchema, 
  verifyPhoneSchema, 
  completeProfileSchema 
} from "@shared/schema";
import { BookOpen, GraduationCap, Phone, Smartphone, User } from "lucide-react";

type AuthStep = "login" | "register" | "verify" | "complete";

export default function AuthPage() {
  const [authStep, setAuthStep] = useState<AuthStep>("login");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [, navigate] = useLocation();
  const { 
    user, 
    loginMutation, 
    sendVerificationMutation, 
    verifyPhoneMutation, 
    completeProfileMutation 
  } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      nationalId: "",
      password: ""
    }
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phoneNumber: ""
    }
  });

  const verifyForm = useForm<VerifyPhoneData>({
    resolver: zodResolver(verifyPhoneSchema),
    defaultValues: {
      phoneNumber: phoneNumber,
      code: ""
    }
  });

  const completeForm = useForm<CompleteProfileData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      nationalId: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "student",
      schoolId: ""
    }
  });

  const handleLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: RegisterData) => {
    setPhoneNumber(data.phoneNumber);
    sendVerificationMutation.mutate(data, {
      onSuccess: () => {
        setAuthStep("verify");
        verifyForm.setValue("phoneNumber", data.phoneNumber);
      }
    });
  };

  const handleVerify = (data: VerifyPhoneData) => {
    verifyPhoneMutation.mutate(data, {
      onSuccess: () => {
        setAuthStep("complete");
      }
    });
  };

  const handleComplete = (data: CompleteProfileData) => {
    completeProfileMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="flex flex-col justify-center space-y-6 text-center lg:text-right">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              دفتر رابط
            </h1>
            <p className="text-xl text-gray-600">
              سیستم مدیریت آموزشی هوشمند با قابلیت‌های پیشرفته
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <GraduationCap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">مدیریت کلاس</h3>
              <p className="text-sm text-gray-600">مدیریت کامل کلاس‌ها و دانش‌آموزان</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">آزمون و تکلیف</h3>
              <p className="text-sm text-gray-600">ایجاد و ارزیابی آزمون‌ها</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">گزارش‌گیری</h3>
              <p className="text-sm text-gray-600">گزارش‌های تحلیلی و آماری</p>
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {authStep === "login" && "ورود به سیستم"}
                {authStep === "register" && "ثبت‌نام"}
                {authStep === "verify" && "تایید شماره تلفن"}
                {authStep === "complete" && "تکمیل اطلاعات"}
              </CardTitle>
              <CardDescription>
                {authStep === "login" && "با کد ملی و رمز عبور وارد شوید"}
                {authStep === "register" && "شماره تلفن خود را وارد کنید"}
                {authStep === "verify" && "کد ارسال شده را وارد کنید"}
                {authStep === "complete" && "اطلاعات خود را تکمیل کنید"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {authStep === "login" && (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="nationalId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>کد ملی</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="1234567890" 
                              {...field}
                              maxLength={10}
                              dir="ltr"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رمز عبور (4 رقم آخر کد ملی)</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="****" 
                              {...field}
                              maxLength={4}
                              dir="ltr"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "در حال ورود..." : "ورود"}
                    </Button>
                    <div className="text-center">
                      <Button 
                        variant="link" 
                        onClick={() => setAuthStep("register")}
                        type="button"
                      >
                        حساب کاربری ندارید؟ ثبت‌نام کنید
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {authStep === "register" && (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>شماره تلفن</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                placeholder="09123456789" 
                                {...field}
                                maxLength={11}
                                dir="ltr"
                                className="pr-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={sendVerificationMutation.isPending}
                    >
                      {sendVerificationMutation.isPending ? "در حال ارسال..." : "ارسال کد تایید"}
                    </Button>
                    <div className="text-center">
                      <Button 
                        variant="link" 
                        onClick={() => setAuthStep("login")}
                        type="button"
                      >
                        حساب کاربری دارید؟ وارد شوید
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {authStep === "verify" && (
                <Form {...verifyForm}>
                  <form onSubmit={verifyForm.handleSubmit(handleVerify)} className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        کد تایید به شماره {phoneNumber} ارسال شد
                      </p>
                    </div>
                    <FormField
                      control={verifyForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>کد تایید</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="123456" 
                              {...field}
                              maxLength={6}
                              dir="ltr"
                              className="text-center text-lg tracking-wider"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={verifyPhoneMutation.isPending}
                    >
                      {verifyPhoneMutation.isPending ? "در حال تایید..." : "تایید"}
                    </Button>
                    <div className="text-center">
                      <Button 
                        variant="link" 
                        onClick={() => setAuthStep("register")}
                        type="button"
                      >
                        ارسال مجدد کد
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {authStep === "complete" && (
                <Form {...completeForm}>
                  <form onSubmit={completeForm.handleSubmit(handleComplete)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={completeForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>نام</FormLabel>
                            <FormControl>
                              <Input placeholder="علی" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={completeForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>نام خانوادگی</FormLabel>
                            <FormControl>
                              <Input placeholder="احمدی" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={completeForm.control}
                      name="nationalId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>کد ملی</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="1234567890" 
                              {...field}
                              maxLength={10}
                              dir="ltr"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={completeForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ایمیل (اختیاری)</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="example@email.com" 
                              {...field} 
                              dir="ltr"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={completeForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نقش</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="نقش خود را انتخاب کنید" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="student">دانش‌آموز</SelectItem>
                              <SelectItem value="teacher">معلم</SelectItem>
                              <SelectItem value="counselor">مشاور</SelectItem>
                              <SelectItem value="educational_deputy">معاون آموزشی</SelectItem>
                              <SelectItem value="liaison_office">دفتر رابط</SelectItem>
                              <SelectItem value="parent">والدین</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={completeProfileMutation.isPending}
                    >
                      {completeProfileMutation.isPending ? "در حال ثبت..." : "تکمیل ثبت‌نام"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}