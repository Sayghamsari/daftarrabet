import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface AIInsights {
  data: any;
  insights: any;
}

class AIService {
  async generateInsights(entityType: string, entityId: string, analysisType: string): Promise<AIInsights> {
    try {
      let prompt = "";
      let systemMessage = "";

      switch (analysisType) {
        case "performance":
          systemMessage = "You are an educational AI analyst. Analyze student performance data and provide actionable insights in Persian (Farsi). Respond with JSON format containing 'data' and 'insights' fields.";
          prompt = `تحلیل عملکرد تحصیلی برای ${entityType} با شناسه ${entityId}. لطفاً الگوهای یادگیری، نقاط قوت و ضعف، و پیشنهادات بهبود را ارائه دهید.`;
          break;
        
        case "attendance":
          systemMessage = "You are an educational AI analyst. Analyze attendance patterns and provide insights in Persian (Farsi). Respond with JSON format containing 'data' and 'insights' fields.";
          prompt = `تحلیل الگوی حضور و غیاب برای ${entityType} با شناسه ${entityId}. هشدارهای لازم و راهکارهای بهبود حضور را ارائه دهید.`;
          break;
        
        case "behavior":
          systemMessage = "You are an educational AI analyst. Analyze behavioral patterns and provide insights in Persian (Farsi). Respond with JSON format containing 'data' and 'insights' fields.";
          prompt = `تحلیل رفتاری برای ${entityType} با شناسه ${entityId}. تغییرات رفتاری و نیاز به مداخله مشاوره‌ای را بررسی کنید.`;
          break;
        
        default:
          systemMessage = "You are an educational AI analyst. Provide general educational insights in Persian (Farsi). Respond with JSON format containing 'data' and 'insights' fields.";
          prompt = `تحلیل عمومی آموزشی برای ${entityType} با شناسه ${entityId}. بینش‌ها و پیشنهادات کلی ارائه دهید.`;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        data: result.data || {},
        insights: result.insights || {}
      };
    } catch (error) {
      console.error("Error generating AI insights:", error);
      
      // Provide fallback insights if AI service fails
      return {
        data: {
          status: "error",
          message: "خطا در تولید تحلیل‌های هوش مصنوعی"
        },
        insights: {
          general: "در حال حاضر امکان تولید تحلیل‌های هوشمند وجود ندارد. لطفاً بعداً تلاش کنید.",
          recommendations: [],
          alerts: []
        }
      };
    }
  }

  async analyzeStudentPerformance(studentId: string, assignments: any[], examResults: any[]): Promise<AIInsights> {
    try {
      const systemMessage = "You are an educational AI analyst specializing in student performance analysis. Analyze the provided data and give insights in Persian (Farsi). Respond with JSON format.";
      
      const prompt = `
        تحلیل عملکرد دانش‌آموز با شناسه ${studentId}:
        
        تکالیف ارسالی: ${JSON.stringify(assignments, null, 2)}
        نتایج آزمون‌ها: ${JSON.stringify(examResults, null, 2)}
        
        لطفاً موارد زیر را تحلیل کنید:
        1. روند پیشرفت تحصیلی
        2. نقاط قوت و ضعف در دروس مختلف
        3. پیشنهادات بهبود
        4. هشدارهای لازم
        5. استراتژی‌های یادگیری مناسب
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        data: {
          studentId,
          assignmentCount: assignments.length,
          examCount: examResults.length,
          averageScore: this.calculateAverageScore(assignments, examResults),
          timestamp: new Date().toISOString()
        },
        insights: result
      };
    } catch (error) {
      console.error("Error analyzing student performance:", error);
      throw error;
    }
  }

  async detectAttendancePatterns(studentId: string, attendanceRecords: any[]): Promise<AIInsights> {
    try {
      const systemMessage = "You are an educational AI analyst specializing in attendance pattern analysis. Provide insights in Persian (Farsi). Respond with JSON format.";
      
      const prompt = `
        تحلیل الگوی حضور و غیاب دانش‌آموز با شناسه ${studentId}:
        
        سوابق حضور: ${JSON.stringify(attendanceRecords, null, 2)}
        
        لطفاً موارد زیر را بررسی کنید:
        1. الگوهای غیبت (روزهای خاص، زمان‌بندی)
        2. میزان تأخیرات
        3. روند بهبود یا وخامت
        4. هشدارهای ریسک تحصیلی
        5. پیشنهادات برای بهبود حضور
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        data: {
          studentId,
          totalRecords: attendanceRecords.length,
          attendanceRate: this.calculateAttendanceRate(attendanceRecords),
          lateCount: attendanceRecords.filter(r => r.status === 'late').length,
          absentCount: attendanceRecords.filter(r => r.status === 'absent').length,
          timestamp: new Date().toISOString()
        },
        insights: result
      };
    } catch (error) {
      console.error("Error detecting attendance patterns:", error);
      throw error;
    }
  }

  async generateClassAnalytics(classId: string, studentsData: any[]): Promise<AIInsights> {
    try {
      const systemMessage = "You are an educational AI analyst specializing in class-wide performance analysis. Provide insights in Persian (Farsi). Respond with JSON format.";
      
      const prompt = `
        تحلیل عملکرد کلاسی برای کلاس با شناسه ${classId}:
        
        اطلاعات دانش‌آموزان: ${JSON.stringify(studentsData, null, 2)}
        
        لطفاً موارد زیر را تحلیل کنید:
        1. میانگین عملکرد کلاس
        2. توزیع نمرات
        3. دانش‌آموزان در معرض خطر
        4. دانش‌آموزان برتر
        5. پیشنهادات بهبود کیفیت تدریس
        6. نیاز به مداخلات آموزشی
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        data: {
          classId,
          studentCount: studentsData.length,
          classAverage: this.calculateClassAverage(studentsData),
          timestamp: new Date().toISOString()
        },
        insights: result
      };
    } catch (error) {
      console.error("Error generating class analytics:", error);
      throw error;
    }
  }

  private calculateAverageScore(assignments: any[], examResults: any[]): number {
    const allScores = [
      ...assignments.filter(a => a.score).map(a => parseFloat(a.score)),
      ...examResults.filter(e => e.score).map(e => parseFloat(e.score))
    ];
    
    if (allScores.length === 0) return 0;
    return allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
  }

  private calculateAttendanceRate(attendanceRecords: any[]): number {
    if (attendanceRecords.length === 0) return 0;
    
    const presentCount = attendanceRecords.filter(r => 
      r.status === 'present' || r.status === 'late'
    ).length;
    
    return (presentCount / attendanceRecords.length) * 100;
  }

  private calculateClassAverage(studentsData: any[]): number {
    if (studentsData.length === 0) return 0;
    
    const averages = studentsData.map(student => student.average || 0);
    return averages.reduce((sum, avg) => sum + avg, 0) / averages.length;
  }
}

export const aiService = new AIService();
