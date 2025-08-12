import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Persian educational system
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nationalId: varchar("national_id", { length: 10 }).unique().notNull(), // کد ملی
  phoneNumber: varchar("phone_number", { length: 11 }).unique().notNull(), // شماره تلفن
  password: varchar("password").notNull(), // رمز عبور (هش شده)
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("student"), // student, teacher, counselor, educational_deputy, liaison_office, parent, principal, vice_principal
  schoolId: varchar("school_id"),
  parentId: varchar("parent_id"), // for students to link to parent
  isVerified: boolean("is_verified").default(false), // تایید شماره تلفن
  isTrialActive: boolean("is_trial_active").default(true),
  trialStartDate: timestamp("trial_start_date").defaultNow(),
  trialEndDate: timestamp("trial_end_date").default(sql`NOW() + INTERVAL '14 days'`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SMS verification codes table
export const smsVerifications = pgTable("sms_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: varchar("phone_number", { length: 11 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  isUsed: boolean("is_used").default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  address: text("address"),
  phone: varchar("phone"),
  email: varchar("email"),
  isTrialActive: boolean("is_trial_active").default(true),
  trialStartDate: timestamp("trial_start_date").defaultNow(),
  trialEndDate: timestamp("trial_end_date").default(sql`NOW() + INTERVAL '14 days'`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  grade: varchar("grade").notNull(),
  subject: varchar("subject").notNull(),
  teacherId: varchar("teacher_id").notNull(),
  schoolId: varchar("school_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  classId: varchar("class_id").notNull(),
  teacherId: varchar("teacher_id").notNull(),
  dueDate: timestamp("due_date").notNull(),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }).notNull(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assignmentId: varchar("assignment_id").notNull(),
  studentId: varchar("student_id").notNull(),
  content: text("content"),
  fileUrl: varchar("file_url"),
  score: decimal("score", { precision: 5, scale: 2 }),
  feedback: text("feedback"),
  isGraded: boolean("is_graded").default(false),
  submittedAt: timestamp("submitted_at").defaultNow(),
  gradedAt: timestamp("graded_at"),
});

export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull(),
  classId: varchar("class_id").notNull(),
  date: date("date").notNull(),
  status: varchar("status").notNull(), // present, absent, late, excused
  entryTime: timestamp("entry_time"),
  exitTime: timestamp("exit_time"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const onlineClassrooms = pgTable("online_classrooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").notNull(),
  platform: varchar("platform").notNull(), // adobe_connect, bigbluebutton, skyroom
  meetingUrl: varchar("meeting_url").notNull(),
  meetingId: varchar("meeting_id"),
  password: varchar("password"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull(), // in minutes
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const questionBank = pgTable("question_bank", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  questionType: varchar("question_type").notNull(), // multiple_choice, essay, fill_blank, true_false
  options: jsonb("options"), // for multiple choice questions
  correctAnswer: text("correct_answer"),
  subject: varchar("subject").notNull(),
  grade: varchar("grade").notNull(),
  difficulty: varchar("difficulty").notNull(), // easy, medium, hard
  tags: text("tags").array(),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const examinations = pgTable("examinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  classId: varchar("class_id").notNull(),
  teacherId: varchar("teacher_id").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull(), // in minutes
  totalScore: decimal("total_score", { precision: 5, scale: 2 }).notNull(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const examQuestions = pgTable("exam_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  examId: varchar("exam_id").notNull(),
  questionId: varchar("question_id").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  order: integer("order").notNull(),
});

export const examResults = pgTable("exam_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  examId: varchar("exam_id").notNull(),
  studentId: varchar("student_id").notNull(),
  answers: jsonb("answers").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }),
  isCompleted: boolean("is_completed").default(false),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const studyMaterials = pgTable("study_materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  fileUrl: varchar("file_url").notNull(),
  fileType: varchar("file_type").notNull(),
  subject: varchar("subject").notNull(),
  grade: varchar("grade").notNull(),
  uploadedBy: varchar("uploaded_by").notNull(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const counselingSessions = pgTable("counseling_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  counselorId: varchar("counselor_id").notNull(),
  studentId: varchar("student_id").notNull(),
  sessionType: varchar("session_type").notNull(), // individual, group
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull(), // in minutes
  notes: text("notes"),
  status: varchar("status").notNull().default("scheduled"), // scheduled, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiAnalytics = pgTable("ai_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: varchar("entity_type").notNull(), // student, class, school
  entityId: varchar("entity_id").notNull(),
  analysisType: varchar("analysis_type").notNull(), // performance, attendance, behavior
  data: jsonb("data").notNull(),
  insights: jsonb("insights").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Disciplinary Records
export const disciplinaryRecords = pgTable("disciplinary_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  teacherId: varchar("teacher_id").references(() => users.id),
  schoolId: varchar("school_id").references(() => schools.id),
  classId: varchar("class_id").references(() => classes.id),
  incidentType: varchar("incident_type", { length: 100 }).notNull(), // tardiness, absence, disruption, etc.
  severity: varchar("severity", { length: 20 }).notNull(), // minor, moderate, major, severe
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  actionTaken: text("action_taken"),
  parentNotified: boolean("parent_notified").default(false),
  resolved: boolean("resolved").default(false),
  incidentDate: timestamp("incident_date").notNull(),
  reportDate: timestamp("report_date").defaultNow(),
  followUpDate: timestamp("follow_up_date"),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).default("active"), // active, resolved, dismissed
  priority: varchar("priority", { length: 20 }).default("normal"), // low, normal, high, urgent
});

// Score System - امتیازات و نمره‌گذاری انضباط
export const scoreSystem = pgTable("score_system", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  semester: varchar("semester", { length: 20 }).notNull(), // first, second
  academicYear: varchar("academic_year", { length: 10 }).notNull(), // 1402-1403
  disciplinaryScore: decimal("disciplinary_score", { precision: 5, scale: 2 }).default('20.00'), // نمره انضباط از 20
  behaviorScore: decimal("behavior_score", { precision: 5, scale: 2 }).default('20.00'), // نمره رفتار از 20
  totalViolations: integer("total_violations").default(0),
  totalAchievements: integer("total_achievements").default(0),
  warningCount: integer("warning_count").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievement System - کارت امتیاز مثبت
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  teacherId: varchar("teacher_id").references(() => users.id),
  schoolId: varchar("school_id").references(() => schools.id),
  achievementType: varchar("achievement_type", { length: 100 }).notNull(), // academic_excellence, good_behavior, participation, etc.
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  points: decimal("points", { precision: 4, scale: 2 }).notNull(), // امتیاز اضافه شده
  category: varchar("category", { length: 50 }).notNull(), // academic, social, sport, art, etc.
  awardDate: timestamp("award_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student-Teacher Assignment - تخصیص دانش‌آموز به معلم
export const studentTeacherAssignments = pgTable("student_teacher_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  teacherId: varchar("teacher_id").references(() => users.id).notNull(),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  classId: varchar("class_id").references(() => classes.id),
  subject: varchar("subject", { length: 100 }),
  assignedBy: varchar("assigned_by").references(() => users.id).notNull(), // principal or vice_principal
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Report Cards - کارنامه‌ها
export const reportCards = pgTable("report_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  semester: varchar("semester", { length: 20 }).notNull(),
  academicYear: varchar("academic_year", { length: 10 }).notNull(),
  disciplinaryGrade: decimal("disciplinary_grade", { precision: 5, scale: 2 }),
  behaviorGrade: decimal("behavior_grade", { precision: 5, scale: 2 }),
  overallGrade: decimal("overall_grade", { precision: 5, scale: 2 }),
  teacherComments: text("teacher_comments"),
  principalComments: text("principal_comments"),
  parentNotified: boolean("parent_notified").default(false),
  issuedAt: timestamp("issued_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tuition Warnings - هشدار شهریه
export const tuitionWarnings = pgTable("tuition_warnings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  parentId: varchar("parent_id").references(() => users.id),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  warningType: varchar("warning_type", { length: 50 }).notNull(), // overdue, upcoming, final
  status: varchar("status", { length: 20 }).default("pending"), // pending, paid, overdue
  sentAt: timestamp("sent_at").defaultNow(),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  school: one(schools, {
    fields: [users.schoolId],
    references: [schools.id],
  }),
  parent: one(users, {
    fields: [users.parentId],
    references: [users.id],
  }),
  children: many(users),
  teachingClasses: many(classes),
  assignments: many(assignments),
  assignmentSubmissions: many(assignmentSubmissions),
  attendance: many(attendance),
  counselingSessions: many(counselingSessions),
  questionBank: many(questionBank),
  studyMaterials: many(studyMaterials),
  disciplinaryRecords: many(disciplinaryRecords),
  scoreSystem: many(scoreSystem),
  achievements: many(achievements),
  studentAssignments: many(studentTeacherAssignments),
  teacherAssignments: many(studentTeacherAssignments),
  reportCards: many(reportCards),
  tuitionWarnings: many(tuitionWarnings),
}));

export const schoolsRelations = relations(schools, ({ many }) => ({
  users: many(users),
  classes: many(classes),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [classes.schoolId],
    references: [schools.id],
  }),
  assignments: many(assignments),
  attendance: many(attendance),
  onlineClassrooms: many(onlineClassrooms),
  examinations: many(examinations),
  disciplinaryRecords: many(disciplinaryRecords),
  scoreSystem: many(scoreSystem),
  achievements: many(achievements),
  studentTeacherAssignments: many(studentTeacherAssignments),
  reportCards: many(reportCards),
  tuitionWarnings: many(tuitionWarnings),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  class: one(classes, {
    fields: [assignments.classId],
    references: [classes.id],
  }),
  teacher: one(users, {
    fields: [assignments.teacherId],
    references: [users.id],
  }),
  submissions: many(assignmentSubmissions),
}));

export const assignmentSubmissionsRelations = relations(assignmentSubmissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [assignmentSubmissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(users, {
    fields: [assignmentSubmissions.studentId],
    references: [users.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(users, {
    fields: [attendance.studentId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [attendance.classId],
    references: [classes.id],
  }),
}));

export const onlineClassroomsRelations = relations(onlineClassrooms, ({ one }) => ({
  class: one(classes, {
    fields: [onlineClassrooms.classId],
    references: [classes.id],
  }),
}));

export const questionBankRelations = relations(questionBank, ({ one }) => ({
  createdBy: one(users, {
    fields: [questionBank.createdBy],
    references: [users.id],
  }),
}));

export const examinationsRelations = relations(examinations, ({ one, many }) => ({
  class: one(classes, {
    fields: [examinations.classId],
    references: [classes.id],
  }),
  teacher: one(users, {
    fields: [examinations.teacherId],
    references: [users.id],
  }),
  questions: many(examQuestions),
  results: many(examResults),
}));

export const examQuestionsRelations = relations(examQuestions, ({ one }) => ({
  exam: one(examinations, {
    fields: [examQuestions.examId],
    references: [examinations.id],
  }),
  question: one(questionBank, {
    fields: [examQuestions.questionId],
    references: [questionBank.id],
  }),
}));

export const examResultsRelations = relations(examResults, ({ one }) => ({
  exam: one(examinations, {
    fields: [examResults.examId],
    references: [examinations.id],
  }),
  student: one(users, {
    fields: [examResults.studentId],
    references: [users.id],
  }),
}));

export const studyMaterialsRelations = relations(studyMaterials, ({ one }) => ({
  uploadedBy: one(users, {
    fields: [studyMaterials.uploadedBy],
    references: [users.id],
  }),
}));

export const counselingSessionsRelations = relations(counselingSessions, ({ one }) => ({
  counselor: one(users, {
    fields: [counselingSessions.counselorId],
    references: [users.id],
  }),
  student: one(users, {
    fields: [counselingSessions.studentId],
    references: [users.id],
  }),
}));

export const disciplinaryRecordsRelations = relations(disciplinaryRecords, ({ one }) => ({
  student: one(users, {
    fields: [disciplinaryRecords.studentId],
    references: [users.id],
  }),
  teacher: one(users, {
    fields: [disciplinaryRecords.teacherId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [disciplinaryRecords.schoolId],
    references: [schools.id],
  }),
  class: one(classes, {
    fields: [disciplinaryRecords.classId],
    references: [classes.id],
  }),
}));

// New relations for extended tables
export const scoreSystemRelations = relations(scoreSystem, ({ one }) => ({
  student: one(users, {
    fields: [scoreSystem.studentId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [scoreSystem.schoolId],
    references: [schools.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  student: one(users, {
    fields: [achievements.studentId],
    references: [users.id],
  }),
  teacher: one(users, {
    fields: [achievements.teacherId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [achievements.schoolId],
    references: [schools.id],
  }),
}));

export const studentTeacherAssignmentsRelations = relations(studentTeacherAssignments, ({ one }) => ({
  student: one(users, {
    fields: [studentTeacherAssignments.studentId],
    references: [users.id],
  }),
  teacher: one(users, {
    fields: [studentTeacherAssignments.teacherId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [studentTeacherAssignments.schoolId],
    references: [schools.id],
  }),
  class: one(classes, {
    fields: [studentTeacherAssignments.classId],
    references: [classes.id],
  }),
  assignedBy: one(users, {
    fields: [studentTeacherAssignments.assignedBy],
    references: [users.id],
  }),
}));

export const reportCardsRelations = relations(reportCards, ({ one }) => ({
  student: one(users, {
    fields: [reportCards.studentId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [reportCards.schoolId],
    references: [schools.id],
  }),
}));

export const tuitionWarningsRelations = relations(tuitionWarnings, ({ one }) => ({
  student: one(users, {
    fields: [tuitionWarnings.studentId],
    references: [users.id],
  }),
  parent: one(users, {
    fields: [tuitionWarnings.parentId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [tuitionWarnings.schoolId],
    references: [schools.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSmsVerificationSchema = createInsertSchema(smsVerifications).omit({
  id: true,
  createdAt: true,
});

export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions).omit({
  id: true,
  submittedAt: true,
  gradedAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertOnlineClassroomSchema = createInsertSchema(onlineClassrooms).omit({
  id: true,
  createdAt: true,
});

export const insertQuestionBankSchema = createInsertSchema(questionBank).omit({
  id: true,
  createdAt: true,
});

export const insertExaminationSchema = createInsertSchema(examinations).omit({
  id: true,
  createdAt: true,
});

export const insertExamQuestionSchema = createInsertSchema(examQuestions).omit({
  id: true,
});

export const insertExamResultSchema = createInsertSchema(examResults).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertStudyMaterialSchema = createInsertSchema(studyMaterials).omit({
  id: true,
  createdAt: true,
});

export const insertCounselingSessionSchema = createInsertSchema(counselingSessions).omit({
  id: true,
  createdAt: true,
});

export const insertAiAnalyticsSchema = createInsertSchema(aiAnalytics).omit({
  id: true,
  generatedAt: true,
});

export const insertDisciplinaryRecordSchema = createInsertSchema(disciplinaryRecords).omit({
  id: true,
  reportDate: true,
});

export const insertScoreSystemSchema = createInsertSchema(scoreSystem).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertStudentTeacherAssignmentSchema = createInsertSchema(studentTeacherAssignments).omit({
  id: true,
  createdAt: true,
});

export const insertReportCardSchema = createInsertSchema(reportCards).omit({
  id: true,
  createdAt: true,
  issuedAt: true,
});

export const insertTuitionWarningSchema = createInsertSchema(tuitionWarnings).omit({
  id: true,
  sentAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// SMS verification types
export type SmsVerification = typeof smsVerifications.$inferSelect;
export type InsertSmsVerification = typeof smsVerifications.$inferInsert;

// Auth schemas
export const loginSchema = z.object({
  nationalId: z.string().length(10, "کد ملی باید 10 رقم باشد"),
  password: z.string().length(4, "رمز عبور باید 4 رقم باشد"),
});

export const registerSchema = z.object({
  phoneNumber: z.string().length(11, "شماره تلفن باید 11 رقم باشد"),
});

export const verifyPhoneSchema = z.object({
  phoneNumber: z.string().length(11, "شماره تلفن باید 11 رقم باشد"),
  code: z.string().length(6, "کد تایید باید 6 رقم باشد"),
});

export const completeProfileSchema = z.object({
  nationalId: z.string().length(10, "کد ملی باید 10 رقم باشد"),
  firstName: z.string().min(1, "نام الزامی است"),
  lastName: z.string().min(1, "نام خانوادگی الزامی است"),
  email: z.string().email("ایمیل معتبر وارد کنید").optional(),
  role: z.enum(["student", "teacher", "counselor", "educational_deputy", "liaison_office", "parent", "principal", "vice_principal"]),
  schoolId: z.string().optional(),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type VerifyPhoneData = z.infer<typeof verifyPhoneSchema>;
export type CompleteProfileData = z.infer<typeof completeProfileSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type School = typeof schools.$inferSelect;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type InsertAssignmentSubmission = z.infer<typeof insertAssignmentSubmissionSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type OnlineClassroom = typeof onlineClassrooms.$inferSelect;
export type InsertOnlineClassroom = z.infer<typeof insertOnlineClassroomSchema>;
export type QuestionBank = typeof questionBank.$inferSelect;
export type InsertQuestionBank = z.infer<typeof insertQuestionBankSchema>;
export type Examination = typeof examinations.$inferSelect;
export type InsertExamination = z.infer<typeof insertExaminationSchema>;
export type ExamQuestion = typeof examQuestions.$inferSelect;
export type InsertExamQuestion = z.infer<typeof insertExamQuestionSchema>;
export type ExamResult = typeof examResults.$inferSelect;
export type InsertExamResult = z.infer<typeof insertExamResultSchema>;
export type StudyMaterial = typeof studyMaterials.$inferSelect;
export type InsertStudyMaterial = z.infer<typeof insertStudyMaterialSchema>;
export type CounselingSession = typeof counselingSessions.$inferSelect;
export type InsertCounselingSession = z.infer<typeof insertCounselingSessionSchema>;
export type AiAnalytics = typeof aiAnalytics.$inferSelect;
export type InsertAiAnalytics = z.infer<typeof insertAiAnalyticsSchema>;
export type DisciplinaryRecord = typeof disciplinaryRecords.$inferSelect;
export type InsertDisciplinaryRecord = z.infer<typeof insertDisciplinaryRecordSchema>;
export type ScoreSystem = typeof scoreSystem.$inferSelect;
export type InsertScoreSystem = z.infer<typeof insertScoreSystemSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type StudentTeacherAssignment = typeof studentTeacherAssignments.$inferSelect;
export type InsertStudentTeacherAssignment = z.infer<typeof insertStudentTeacherAssignmentSchema>;
export type ReportCard = typeof reportCards.$inferSelect;
export type InsertReportCard = z.infer<typeof insertReportCardSchema>;
export type TuitionWarning = typeof tuitionWarnings.$inferSelect;
export type InsertTuitionWarning = z.infer<typeof insertTuitionWarningSchema>;
