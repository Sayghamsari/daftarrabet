import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { aiService } from "./aiService";
import {
  insertAssignmentSchema,
  insertAssignmentSubmissionSchema,
  insertAttendanceSchema,
  insertOnlineClassroomSchema,
  insertQuestionBankSchema,
  insertExaminationSchema,
  insertExamQuestionSchema,
  insertExamResultSchema,
  insertStudyMaterialSchema,
  insertCounselingSessionSchema,
  insertClassSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/student/:id', isAuthenticated, async (req: any, res) => {
    try {
      const studentId = req.params.id;
      const userId = req.user.claims.sub;
      
      // Ensure user can only access their own dashboard or their child's dashboard
      const user = await storage.getUser(userId);
      if (user?.role !== 'student' && user?.role !== 'parent') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      if (user.role === 'student' && studentId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      if (user.role === 'parent') {
        const student = await storage.getUser(studentId);
        if (student?.parentId !== userId) {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      // Get student's assignments, attendance, and AI analytics
      const assignments = await storage.getSubmissionsByStudent(studentId);
      const attendance = await storage.getAttendanceByStudent(studentId);
      const analytics = await storage.getAiAnalytics('student', studentId);

      res.json({
        assignments,
        attendance,
        analytics,
      });
    } catch (error) {
      console.error("Error fetching student dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get('/api/dashboard/teacher/:id', isAuthenticated, async (req: any, res) => {
    try {
      const teacherId = req.params.id;
      const userId = req.user.claims.sub;
      
      // Ensure user is the teacher or has admin access
      if (teacherId !== userId) {
        const user = await storage.getUser(userId);
        if (user?.role !== 'educational_deputy' && user?.role !== 'liaison_office') {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      const classes = await storage.getClassesByTeacher(teacherId);
      const assignments = await storage.getAssignmentsByTeacher(teacherId);
      const examinations = await storage.getExaminationsByTeacher(teacherId);

      res.json({
        classes,
        assignments,
        examinations,
      });
    } catch (error) {
      console.error("Error fetching teacher dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Class management routes
  app.post('/api/classes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher' && user?.role !== 'educational_deputy') {
        return res.status(403).json({ message: "Access denied" });
      }

      const classData = insertClassSchema.parse(req.body);
      const newClass = await storage.createClass(classData);
      
      res.status(201).json(newClass);
    } catch (error) {
      console.error("Error creating class:", error);
      res.status(500).json({ message: "Failed to create class" });
    }
  });

  app.get('/api/classes/teacher/:teacherId', isAuthenticated, async (req: any, res) => {
    try {
      const teacherId = req.params.teacherId;
      const classes = await storage.getClassesByTeacher(teacherId);
      res.json(classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  // Assignment routes
  app.post('/api/assignments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher') {
        return res.status(403).json({ message: "Access denied" });
      }

      const assignmentData = insertAssignmentSchema.parse(req.body);
      const assignment = await storage.createAssignment(assignmentData);
      
      res.status(201).json(assignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });

  app.get('/api/assignments/class/:classId', isAuthenticated, async (req: any, res) => {
    try {
      const classId = req.params.classId;
      const assignments = await storage.getAssignmentsByClass(classId);
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.put('/api/assignments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const assignmentId = req.params.id;
      const userId = req.user.claims.sub;
      
      const assignment = await storage.getAssignment(assignmentId);
      if (!assignment || assignment.teacherId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedAssignment = await storage.updateAssignment(assignmentId, req.body);
      res.json(updatedAssignment);
    } catch (error) {
      console.error("Error updating assignment:", error);
      res.status(500).json({ message: "Failed to update assignment" });
    }
  });

  // Assignment submission routes
  app.post('/api/assignments/:id/submit', isAuthenticated, async (req: any, res) => {
    try {
      const assignmentId = req.params.id;
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'student') {
        return res.status(403).json({ message: "Access denied" });
      }

      const submissionData = insertAssignmentSubmissionSchema.parse({
        ...req.body,
        assignmentId,
        studentId: userId,
      });
      
      const submission = await storage.createAssignmentSubmission(submissionData);
      res.status(201).json(submission);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      res.status(500).json({ message: "Failed to submit assignment" });
    }
  });

  app.get('/api/assignments/:id/submissions', isAuthenticated, async (req: any, res) => {
    try {
      const assignmentId = req.params.id;
      const userId = req.user.claims.sub;
      
      const assignment = await storage.getAssignment(assignmentId);
      if (!assignment || assignment.teacherId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const submissions = await storage.getSubmissionsByAssignment(assignmentId);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.put('/api/submissions/:id/grade', isAuthenticated, async (req: any, res) => {
    try {
      const submissionId = req.params.id;
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher') {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedSubmission = await storage.updateAssignmentSubmission(submissionId, {
        ...req.body,
        isGraded: true,
        gradedAt: new Date(),
      });
      
      res.json(updatedSubmission);
    } catch (error) {
      console.error("Error grading submission:", error);
      res.status(500).json({ message: "Failed to grade submission" });
    }
  });

  // Attendance routes
  app.post('/api/attendance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher') {
        return res.status(403).json({ message: "Access denied" });
      }

      const attendanceData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.createAttendance(attendanceData);
      
      // Check for tardiness and send notification to parents if needed
      if (attendance.status === 'late') {
        // TODO: Implement notification service
        console.log(`Student ${attendance.studentId} was late on ${attendance.date}`);
      }
      
      res.status(201).json(attendance);
    } catch (error) {
      console.error("Error recording attendance:", error);
      res.status(500).json({ message: "Failed to record attendance" });
    }
  });

  app.get('/api/attendance/student/:studentId', isAuthenticated, async (req: any, res) => {
    try {
      const studentId = req.params.studentId;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const attendance = await storage.getAttendanceByStudent(studentId, start, end);
      res.json(attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({ message: "Failed to fetch attendance" });
    }
  });

  app.get('/api/attendance/class/:classId', isAuthenticated, async (req: any, res) => {
    try {
      const classId = req.params.classId;
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }
      
      const attendance = await storage.getAttendanceByClass(classId, new Date(date as string));
      res.json(attendance);
    } catch (error) {
      console.error("Error fetching class attendance:", error);
      res.status(500).json({ message: "Failed to fetch class attendance" });
    }
  });

  // Online classroom routes
  app.post('/api/online-classrooms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher') {
        return res.status(403).json({ message: "Access denied" });
      }

      const classroomData = insertOnlineClassroomSchema.parse(req.body);
      const classroom = await storage.createOnlineClassroom(classroomData);
      
      res.status(201).json(classroom);
    } catch (error) {
      console.error("Error creating online classroom:", error);
      res.status(500).json({ message: "Failed to create online classroom" });
    }
  });

  app.get('/api/online-classrooms/class/:classId', isAuthenticated, async (req: any, res) => {
    try {
      const classId = req.params.classId;
      const classrooms = await storage.getOnlineClassroomsByClass(classId);
      res.json(classrooms);
    } catch (error) {
      console.error("Error fetching online classrooms:", error);
      res.status(500).json({ message: "Failed to fetch online classrooms" });
    }
  });

  // Question bank routes
  app.post('/api/questions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher' && user?.role !== 'educational_deputy') {
        return res.status(403).json({ message: "Access denied" });
      }

      const questionData = insertQuestionBankSchema.parse({
        ...req.body,
        createdBy: userId,
      });
      
      const question = await storage.createQuestion(questionData);
      res.status(201).json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ message: "Failed to create question" });
    }
  });

  app.get('/api/questions/search', isAuthenticated, async (req: any, res) => {
    try {
      const { q, subject, grade, difficulty } = req.query;
      
      if (!q) {
        return res.status(400).json({ message: "Search term is required" });
      }
      
      const questions = await storage.searchQuestions(q as string, {
        subject: subject as string,
        grade: grade as string,
        difficulty: difficulty as string,
      });
      
      res.json(questions);
    } catch (error) {
      console.error("Error searching questions:", error);
      res.status(500).json({ message: "Failed to search questions" });
    }
  });

  app.get('/api/questions/subject/:subject', isAuthenticated, async (req: any, res) => {
    try {
      const subject = req.params.subject;
      const { grade } = req.query;
      
      const questions = await storage.getQuestionsBySubject(subject, grade as string);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Examination routes
  app.post('/api/examinations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher') {
        return res.status(403).json({ message: "Access denied" });
      }

      const examData = insertExaminationSchema.parse(req.body);
      const exam = await storage.createExamination(examData);
      
      res.status(201).json(exam);
    } catch (error) {
      console.error("Error creating examination:", error);
      res.status(500).json({ message: "Failed to create examination" });
    }
  });

  app.get('/api/examinations/class/:classId', isAuthenticated, async (req: any, res) => {
    try {
      const classId = req.params.classId;
      const examinations = await storage.getExaminationsByClass(classId);
      res.json(examinations);
    } catch (error) {
      console.error("Error fetching examinations:", error);
      res.status(500).json({ message: "Failed to fetch examinations" });
    }
  });

  // AI Analytics routes
  app.get('/api/analytics/:entityType/:entityId', isAuthenticated, async (req: any, res) => {
    try {
      const { entityType, entityId } = req.params;
      const { analysisType } = req.query;
      
      const analytics = await storage.getAiAnalytics(entityType, entityId, analysisType as string);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.post('/api/analytics/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher' && user?.role !== 'educational_deputy' && user?.role !== 'counselor') {
        return res.status(403).json({ message: "Access denied" });
      }

      const { entityType, entityId, analysisType } = req.body;
      
      // Generate AI insights based on entity type and analysis type
      const insights = await aiService.generateInsights(entityType, entityId, analysisType);
      
      const analytics = await storage.createAiAnalytics({
        entityType,
        entityId,
        analysisType,
        data: insights.data,
        insights: insights.insights,
      });
      
      res.json(analytics);
    } catch (error) {
      console.error("Error generating analytics:", error);
      res.status(500).json({ message: "Failed to generate analytics" });
    }
  });

  // Counseling session routes
  app.post('/api/counseling-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'counselor') {
        return res.status(403).json({ message: "Access denied" });
      }

      const sessionData = insertCounselingSessionSchema.parse(req.body);
      const session = await storage.createCounselingSession(sessionData);
      
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating counseling session:", error);
      res.status(500).json({ message: "Failed to create counseling session" });
    }
  });

  app.get('/api/counseling-sessions/counselor/:counselorId', isAuthenticated, async (req: any, res) => {
    try {
      const counselorId = req.params.counselorId;
      const sessions = await storage.getCounselingSessionsByCounselor(counselorId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching counseling sessions:", error);
      res.status(500).json({ message: "Failed to fetch counseling sessions" });
    }
  });

  app.get('/api/counseling-sessions/student/:studentId', isAuthenticated, async (req: any, res) => {
    try {
      const studentId = req.params.studentId;
      const sessions = await storage.getCounselingSessionsByStudent(studentId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching student counseling sessions:", error);
      res.status(500).json({ message: "Failed to fetch student counseling sessions" });
    }
  });

  // Study materials routes
  app.post('/api/study-materials', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher' && user?.role !== 'educational_deputy') {
        return res.status(403).json({ message: "Access denied" });
      }

      const materialData = insertStudyMaterialSchema.parse({
        ...req.body,
        uploadedBy: userId,
      });
      
      const material = await storage.createStudyMaterial(materialData);
      res.status(201).json(material);
    } catch (error) {
      console.error("Error creating study material:", error);
      res.status(500).json({ message: "Failed to create study material" });
    }
  });

  app.get('/api/study-materials/subject/:subject', isAuthenticated, async (req: any, res) => {
    try {
      const subject = req.params.subject;
      const { grade } = req.query;
      
      const materials = await storage.getStudyMaterialsBySubject(subject, grade as string);
      res.json(materials);
    } catch (error) {
      console.error("Error fetching study materials:", error);
      res.status(500).json({ message: "Failed to fetch study materials" });
    }
  });

  app.get('/api/study-materials/public', isAuthenticated, async (req: any, res) => {
    try {
      const materials = await storage.getPublicStudyMaterials();
      res.json(materials);
    } catch (error) {
      console.error("Error fetching public study materials:", error);
      res.status(500).json({ message: "Failed to fetch public study materials" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
