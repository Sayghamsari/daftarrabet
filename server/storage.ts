import {
  users,
  schools,
  classes,
  assignments,
  assignmentSubmissions,
  attendance,
  onlineClassrooms,
  questionBank,
  examinations,
  examQuestions,
  examResults,
  studyMaterials,
  counselingSessions,
  aiAnalytics,
  type User,
  type UpsertUser,
  type School,
  type InsertSchool,
  type Class,
  type InsertClass,
  type Assignment,
  type InsertAssignment,
  type AssignmentSubmission,
  type InsertAssignmentSubmission,
  type Attendance,
  type InsertAttendance,
  type OnlineClassroom,
  type InsertOnlineClassroom,
  type QuestionBank,
  type InsertQuestionBank,
  type Examination,
  type InsertExamination,
  type ExamQuestion,
  type InsertExamQuestion,
  type ExamResult,
  type InsertExamResult,
  type StudyMaterial,
  type InsertStudyMaterial,
  type CounselingSession,
  type InsertCounselingSession,
  type AiAnalytics,
  type InsertAiAnalytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, gte, lte, like, inArray } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // School operations
  createSchool(school: InsertSchool): Promise<School>;
  getSchool(id: string): Promise<School | undefined>;
  getSchoolUsers(schoolId: string): Promise<User[]>;
  
  // Class operations
  createClass(classData: InsertClass): Promise<Class>;
  getClass(id: string): Promise<Class | undefined>;
  getClassesByTeacher(teacherId: string): Promise<Class[]>;
  getClassesBySchool(schoolId: string): Promise<Class[]>;
  
  // Assignment operations
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  getAssignment(id: string): Promise<Assignment | undefined>;
  getAssignmentsByClass(classId: string): Promise<Assignment[]>;
  getAssignmentsByTeacher(teacherId: string): Promise<Assignment[]>;
  updateAssignment(id: string, updates: Partial<Assignment>): Promise<Assignment>;
  
  // Assignment submission operations
  createAssignmentSubmission(submission: InsertAssignmentSubmission): Promise<AssignmentSubmission>;
  getAssignmentSubmission(id: string): Promise<AssignmentSubmission | undefined>;
  getSubmissionsByAssignment(assignmentId: string): Promise<AssignmentSubmission[]>;
  getSubmissionsByStudent(studentId: string): Promise<AssignmentSubmission[]>;
  updateAssignmentSubmission(id: string, updates: Partial<AssignmentSubmission>): Promise<AssignmentSubmission>;
  
  // Attendance operations
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  getAttendanceByStudent(studentId: string, startDate?: Date, endDate?: Date): Promise<Attendance[]>;
  getAttendanceByClass(classId: string, date: Date): Promise<Attendance[]>;
  updateAttendance(id: string, updates: Partial<Attendance>): Promise<Attendance>;
  
  // Online classroom operations
  createOnlineClassroom(classroom: InsertOnlineClassroom): Promise<OnlineClassroom>;
  getOnlineClassroom(id: string): Promise<OnlineClassroom | undefined>;
  getOnlineClassroomsByClass(classId: string): Promise<OnlineClassroom[]>;
  updateOnlineClassroom(id: string, updates: Partial<OnlineClassroom>): Promise<OnlineClassroom>;
  
  // Question bank operations
  createQuestion(question: InsertQuestionBank): Promise<QuestionBank>;
  getQuestion(id: string): Promise<QuestionBank | undefined>;
  getQuestionsBySubject(subject: string, grade?: string): Promise<QuestionBank[]>;
  searchQuestions(searchTerm: string, filters?: { subject?: string; grade?: string; difficulty?: string }): Promise<QuestionBank[]>;
  
  // Examination operations
  createExamination(exam: InsertExamination): Promise<Examination>;
  getExamination(id: string): Promise<Examination | undefined>;
  getExaminationsByClass(classId: string): Promise<Examination[]>;
  getExaminationsByTeacher(teacherId: string): Promise<Examination[]>;
  updateExamination(id: string, updates: Partial<Examination>): Promise<Examination>;
  
  // Exam question operations
  addQuestionToExam(examQuestion: InsertExamQuestion): Promise<ExamQuestion>;
  getExamQuestions(examId: string): Promise<ExamQuestion[]>;
  
  // Exam result operations
  createExamResult(result: InsertExamResult): Promise<ExamResult>;
  getExamResult(id: string): Promise<ExamResult | undefined>;
  getExamResultsByStudent(studentId: string): Promise<ExamResult[]>;
  getExamResultsByExam(examId: string): Promise<ExamResult[]>;
  updateExamResult(id: string, updates: Partial<ExamResult>): Promise<ExamResult>;
  
  // Study material operations
  createStudyMaterial(material: InsertStudyMaterial): Promise<StudyMaterial>;
  getStudyMaterial(id: string): Promise<StudyMaterial | undefined>;
  getStudyMaterialsBySubject(subject: string, grade?: string): Promise<StudyMaterial[]>;
  getPublicStudyMaterials(): Promise<StudyMaterial[]>;
  
  // Counseling session operations
  createCounselingSession(session: InsertCounselingSession): Promise<CounselingSession>;
  getCounselingSession(id: string): Promise<CounselingSession | undefined>;
  getCounselingSessionsByCounselor(counselorId: string): Promise<CounselingSession[]>;
  getCounselingSessionsByStudent(studentId: string): Promise<CounselingSession[]>;
  updateCounselingSession(id: string, updates: Partial<CounselingSession>): Promise<CounselingSession>;
  
  // AI analytics operations
  createAiAnalytics(analytics: InsertAiAnalytics): Promise<AiAnalytics>;
  getAiAnalytics(entityType: string, entityId: string, analysisType?: string): Promise<AiAnalytics[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // School operations
  async createSchool(school: InsertSchool): Promise<School> {
    const [newSchool] = await db.insert(schools).values(school).returning();
    return newSchool;
  }

  async getSchool(id: string): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.id, id));
    return school;
  }

  async getSchoolUsers(schoolId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.schoolId, schoolId));
  }
  
  // Class operations
  async createClass(classData: InsertClass): Promise<Class> {
    const [newClass] = await db.insert(classes).values(classData).returning();
    return newClass;
  }

  async getClass(id: string): Promise<Class | undefined> {
    const [classItem] = await db.select().from(classes).where(eq(classes.id, id));
    return classItem;
  }

  async getClassesByTeacher(teacherId: string): Promise<Class[]> {
    return await db.select().from(classes).where(eq(classes.teacherId, teacherId));
  }

  async getClassesBySchool(schoolId: string): Promise<Class[]> {
    return await db.select().from(classes).where(eq(classes.schoolId, schoolId));
  }
  
  // Assignment operations
  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [newAssignment] = await db.insert(assignments).values(assignment).returning();
    return newAssignment;
  }

  async getAssignment(id: string): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment;
  }

  async getAssignmentsByClass(classId: string): Promise<Assignment[]> {
    return await db.select().from(assignments).where(eq(assignments.classId, classId)).orderBy(desc(assignments.createdAt));
  }

  async getAssignmentsByTeacher(teacherId: string): Promise<Assignment[]> {
    return await db.select().from(assignments).where(eq(assignments.teacherId, teacherId)).orderBy(desc(assignments.createdAt));
  }

  async updateAssignment(id: string, updates: Partial<Assignment>): Promise<Assignment> {
    const [updatedAssignment] = await db
      .update(assignments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(assignments.id, id))
      .returning();
    return updatedAssignment;
  }
  
  // Assignment submission operations
  async createAssignmentSubmission(submission: InsertAssignmentSubmission): Promise<AssignmentSubmission> {
    const [newSubmission] = await db.insert(assignmentSubmissions).values(submission).returning();
    return newSubmission;
  }

  async getAssignmentSubmission(id: string): Promise<AssignmentSubmission | undefined> {
    const [submission] = await db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.id, id));
    return submission;
  }

  async getSubmissionsByAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
    return await db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.assignmentId, assignmentId));
  }

  async getSubmissionsByStudent(studentId: string): Promise<AssignmentSubmission[]> {
    return await db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.studentId, studentId)).orderBy(desc(assignmentSubmissions.submittedAt));
  }

  async updateAssignmentSubmission(id: string, updates: Partial<AssignmentSubmission>): Promise<AssignmentSubmission> {
    const [updatedSubmission] = await db
      .update(assignmentSubmissions)
      .set(updates)
      .where(eq(assignmentSubmissions.id, id))
      .returning();
    return updatedSubmission;
  }
  
  // Attendance operations
  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db.insert(attendance).values(attendanceData).returning();
    return newAttendance;
  }

  async getAttendanceByStudent(studentId: string, startDate?: Date, endDate?: Date): Promise<Attendance[]> {
    let query = db.select().from(attendance).where(eq(attendance.studentId, studentId));
    
    if (startDate && endDate) {
      query = query.where(and(
        gte(attendance.date, startDate.toISOString().split('T')[0]),
        lte(attendance.date, endDate.toISOString().split('T')[0])
      ));
    }
    
    return await query.orderBy(desc(attendance.date));
  }

  async getAttendanceByClass(classId: string, date: Date): Promise<Attendance[]> {
    return await db.select().from(attendance).where(
      and(
        eq(attendance.classId, classId),
        eq(attendance.date, date.toISOString().split('T')[0])
      )
    );
  }

  async updateAttendance(id: string, updates: Partial<Attendance>): Promise<Attendance> {
    const [updatedAttendance] = await db
      .update(attendance)
      .set(updates)
      .where(eq(attendance.id, id))
      .returning();
    return updatedAttendance;
  }
  
  // Online classroom operations
  async createOnlineClassroom(classroom: InsertOnlineClassroom): Promise<OnlineClassroom> {
    const [newClassroom] = await db.insert(onlineClassrooms).values(classroom).returning();
    return newClassroom;
  }

  async getOnlineClassroom(id: string): Promise<OnlineClassroom | undefined> {
    const [classroom] = await db.select().from(onlineClassrooms).where(eq(onlineClassrooms.id, id));
    return classroom;
  }

  async getOnlineClassroomsByClass(classId: string): Promise<OnlineClassroom[]> {
    return await db.select().from(onlineClassrooms).where(eq(onlineClassrooms.classId, classId)).orderBy(desc(onlineClassrooms.scheduledAt));
  }

  async updateOnlineClassroom(id: string, updates: Partial<OnlineClassroom>): Promise<OnlineClassroom> {
    const [updatedClassroom] = await db
      .update(onlineClassrooms)
      .set(updates)
      .where(eq(onlineClassrooms.id, id))
      .returning();
    return updatedClassroom;
  }
  
  // Question bank operations
  async createQuestion(question: InsertQuestionBank): Promise<QuestionBank> {
    const [newQuestion] = await db.insert(questionBank).values(question).returning();
    return newQuestion;
  }

  async getQuestion(id: string): Promise<QuestionBank | undefined> {
    const [question] = await db.select().from(questionBank).where(eq(questionBank.id, id));
    return question;
  }

  async getQuestionsBySubject(subject: string, grade?: string): Promise<QuestionBank[]> {
    let query = db.select().from(questionBank).where(eq(questionBank.subject, subject));
    
    if (grade) {
      query = query.where(eq(questionBank.grade, grade));
    }
    
    return await query.orderBy(desc(questionBank.createdAt));
  }

  async searchQuestions(searchTerm: string, filters?: { subject?: string; grade?: string; difficulty?: string }): Promise<QuestionBank[]> {
    let query = db.select().from(questionBank).where(like(questionBank.question, `%${searchTerm}%`));
    
    if (filters?.subject) {
      query = query.where(eq(questionBank.subject, filters.subject));
    }
    if (filters?.grade) {
      query = query.where(eq(questionBank.grade, filters.grade));
    }
    if (filters?.difficulty) {
      query = query.where(eq(questionBank.difficulty, filters.difficulty));
    }
    
    return await query.orderBy(desc(questionBank.createdAt));
  }
  
  // Examination operations
  async createExamination(exam: InsertExamination): Promise<Examination> {
    const [newExam] = await db.insert(examinations).values(exam).returning();
    return newExam;
  }

  async getExamination(id: string): Promise<Examination | undefined> {
    const [exam] = await db.select().from(examinations).where(eq(examinations.id, id));
    return exam;
  }

  async getExaminationsByClass(classId: string): Promise<Examination[]> {
    return await db.select().from(examinations).where(eq(examinations.classId, classId)).orderBy(desc(examinations.scheduledAt));
  }

  async getExaminationsByTeacher(teacherId: string): Promise<Examination[]> {
    return await db.select().from(examinations).where(eq(examinations.teacherId, teacherId)).orderBy(desc(examinations.scheduledAt));
  }

  async updateExamination(id: string, updates: Partial<Examination>): Promise<Examination> {
    const [updatedExam] = await db
      .update(examinations)
      .set(updates)
      .where(eq(examinations.id, id))
      .returning();
    return updatedExam;
  }
  
  // Exam question operations
  async addQuestionToExam(examQuestion: InsertExamQuestion): Promise<ExamQuestion> {
    const [newExamQuestion] = await db.insert(examQuestions).values(examQuestion).returning();
    return newExamQuestion;
  }

  async getExamQuestions(examId: string): Promise<ExamQuestion[]> {
    return await db.select().from(examQuestions).where(eq(examQuestions.examId, examId)).orderBy(asc(examQuestions.order));
  }
  
  // Exam result operations
  async createExamResult(result: InsertExamResult): Promise<ExamResult> {
    const [newResult] = await db.insert(examResults).values(result).returning();
    return newResult;
  }

  async getExamResult(id: string): Promise<ExamResult | undefined> {
    const [result] = await db.select().from(examResults).where(eq(examResults.id, id));
    return result;
  }

  async getExamResultsByStudent(studentId: string): Promise<ExamResult[]> {
    return await db.select().from(examResults).where(eq(examResults.studentId, studentId)).orderBy(desc(examResults.startedAt));
  }

  async getExamResultsByExam(examId: string): Promise<ExamResult[]> {
    return await db.select().from(examResults).where(eq(examResults.examId, examId));
  }

  async updateExamResult(id: string, updates: Partial<ExamResult>): Promise<ExamResult> {
    const [updatedResult] = await db
      .update(examResults)
      .set(updates)
      .where(eq(examResults.id, id))
      .returning();
    return updatedResult;
  }
  
  // Study material operations
  async createStudyMaterial(material: InsertStudyMaterial): Promise<StudyMaterial> {
    const [newMaterial] = await db.insert(studyMaterials).values(material).returning();
    return newMaterial;
  }

  async getStudyMaterial(id: string): Promise<StudyMaterial | undefined> {
    const [material] = await db.select().from(studyMaterials).where(eq(studyMaterials.id, id));
    return material;
  }

  async getStudyMaterialsBySubject(subject: string, grade?: string): Promise<StudyMaterial[]> {
    let query = db.select().from(studyMaterials).where(eq(studyMaterials.subject, subject));
    
    if (grade) {
      query = query.where(eq(studyMaterials.grade, grade));
    }
    
    return await query.orderBy(desc(studyMaterials.createdAt));
  }

  async getPublicStudyMaterials(): Promise<StudyMaterial[]> {
    return await db.select().from(studyMaterials).where(eq(studyMaterials.isPublic, true)).orderBy(desc(studyMaterials.createdAt));
  }
  
  // Counseling session operations
  async createCounselingSession(session: InsertCounselingSession): Promise<CounselingSession> {
    const [newSession] = await db.insert(counselingSessions).values(session).returning();
    return newSession;
  }

  async getCounselingSession(id: string): Promise<CounselingSession | undefined> {
    const [session] = await db.select().from(counselingSessions).where(eq(counselingSessions.id, id));
    return session;
  }

  async getCounselingSessionsByCounselor(counselorId: string): Promise<CounselingSession[]> {
    return await db.select().from(counselingSessions).where(eq(counselingSessions.counselorId, counselorId)).orderBy(desc(counselingSessions.scheduledAt));
  }

  async getCounselingSessionsByStudent(studentId: string): Promise<CounselingSession[]> {
    return await db.select().from(counselingSessions).where(eq(counselingSessions.studentId, studentId)).orderBy(desc(counselingSessions.scheduledAt));
  }

  async updateCounselingSession(id: string, updates: Partial<CounselingSession>): Promise<CounselingSession> {
    const [updatedSession] = await db
      .update(counselingSessions)
      .set(updates)
      .where(eq(counselingSessions.id, id))
      .returning();
    return updatedSession;
  }
  
  // AI analytics operations
  async createAiAnalytics(analytics: InsertAiAnalytics): Promise<AiAnalytics> {
    const [newAnalytics] = await db.insert(aiAnalytics).values(analytics).returning();
    return newAnalytics;
  }

  async getAiAnalytics(entityType: string, entityId: string, analysisType?: string): Promise<AiAnalytics[]> {
    let query = db.select().from(aiAnalytics).where(
      and(
        eq(aiAnalytics.entityType, entityType),
        eq(aiAnalytics.entityId, entityId)
      )
    );
    
    if (analysisType) {
      query = query.where(eq(aiAnalytics.analysisType, analysisType));
    }
    
    return await query.orderBy(desc(aiAnalytics.generatedAt));
  }
}

export const storage = new DatabaseStorage();
