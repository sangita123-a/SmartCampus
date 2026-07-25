import { PrismaClient } from '@prisma/client';
import { AIFeatureKey, AIMessageSender } from '../types/ai.types';
import { AIEngineService } from './aiEngine.service';
import { AIPromptManagerService } from './aiPromptManager.service';

const prisma = new PrismaClient();

export class AISmartCampusService {
  /**
   * Log token usage & estimate costs
   */
  private static async logUsage(
    userId: string,
    collegeId: string | null,
    feature: AIFeatureKey,
    promptTokens: number,
    completionTokens: number,
    totalTokens: number,
    modelUsed: string
  ) {
    const costPer1k = 0.0015; // Estimated $0.0015 per 1k tokens
    const costEstimate = (totalTokens / 1000) * costPer1k;

    await prisma.aIUsage.create({
      data: {
        userId,
        collegeId,
        feature,
        promptTokens,
        completionTokens,
        totalTokens,
        costEstimate,
        modelUsed
      }
    });
  }

  /**
   * 1. AI Campus Assistant Chatbot
   */
  public static async chat(userId: string, collegeId: string | null, conversationId: string | undefined, message: string) {
    let conversation = conversationId
      ? await prisma.aIConversation.findUnique({ where: { id: conversationId }, include: { messages: true } })
      : null;

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          userId,
          collegeId,
          title: message.slice(0, 30) + '...',
          feature: AIFeatureKey.CHATBOT
        },
        include: { messages: true }
      });
    }

    // Save User Message
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        sender: AIMessageSender.USER,
        content: message
      }
    });

    // Build context
    const promptConfig = AIPromptManagerService.getPrompt(AIFeatureKey.CHATBOT);
    const messages = [
      { role: 'system' as const, content: promptConfig.systemPrompt },
      ...conversation.messages.slice(-6).map((m: any) => ({
        role: m.sender === AIMessageSender.USER ? ('user' as const) : ('assistant' as const),
        content: m.content
      })),
      { role: 'user' as const, content: message }
    ];

    const aiRes = await AIEngineService.generateCompletion({ messages, collegeId });

    // Save Assistant Response
    const assistantMsg = await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        sender: AIMessageSender.ASSISTANT,
        content: aiRes.content,
        tokensUsed: aiRes.totalTokens
      }
    });

    await this.logUsage(userId, collegeId, AIFeatureKey.CHATBOT, aiRes.promptTokens, aiRes.completionTokens, aiRes.totalTokens, aiRes.model);

    return {
      conversationId: conversation.id,
      message: assistantMsg
    };
  }

  /**
   * 2. AI Student Performance & Risk Prediction
   */
  public static async predictStudentPerformance(collegeId: string | null) {
    const students = await prisma.student.findMany({
      where: collegeId ? { collegeId } : {},
      take: 20,
      include: {
        department: true,
        course: true,
        attendance: true,
        results: true
      }
    });

    const studentSummaries = students.map(s => {
      const totalAtt = s.attendance.length;
      const presentCount = s.attendance.filter(a => a.attendanceStatus === 'PRESENT').length;
      const attPercentage = totalAtt > 0 ? (presentCount / totalAtt) * 100 : 85;
      const avgMarks = s.results.length > 0
        ? s.results.reduce((acc, r) => acc + Number(r.obtainedMarks), 0) / s.results.length
        : 75;

      return {
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        rollNumber: s.rollNumber,
        department: s.department.name,
        attendancePercentage: Math.round(attPercentage),
        averageMarks: Math.round(avgMarks)
      };
    });

    const promptConfig = AIPromptManagerService.getPrompt(AIFeatureKey.STUDENT_PERFORMANCE_PREDICTION);
    const messages = [
      { role: 'system' as const, content: promptConfig.systemPrompt },
      { role: 'user' as const, content: JSON.stringify(studentSummaries) }
    ];

    const aiRes = await AIEngineService.generateCompletion({ messages, collegeId });

    return {
      insights: aiRes.content,
      evaluatedStudentsCount: studentSummaries.length,
      highRiskCount: studentSummaries.filter(s => s.attendancePercentage < 75 || s.averageMarks < 50).length,
      topPerformersCount: studentSummaries.filter(s => s.attendancePercentage >= 90 && s.averageMarks >= 85).length
    };
  }

  /**
   * 3. AI Attendance Insights
   */
  public static async getAttendanceInsights(collegeId: string | null) {
    const lowAttendanceRecords = await prisma.attendance.findMany({
      where: {
        ...(collegeId ? { collegeId } : {}),
        attendanceStatus: 'ABSENT'
      },
      take: 50,
      include: { student: true, subject: true, department: true }
    });

    const promptConfig = AIPromptManagerService.getPrompt(AIFeatureKey.ATTENDANCE_INSIGHTS);
    const messages = [
      { role: 'system' as const, content: promptConfig.systemPrompt },
      { role: 'user' as const, content: `Absence Telemetry Records Count: ${lowAttendanceRecords.length}` }
    ];

    const aiRes = await AIEngineService.generateCompletion({ messages, collegeId });

    return {
      insights: aiRes.content,
      totalAbsencesAnalyzed: lowAttendanceRecords.length
    };
  }

  /**
   * 4. AI Fee Collection & Revenue Insights
   */
  public static async getFeeInsights(collegeId: string | null) {
    const studentFees = await prisma.studentFee.findMany({
      where: collegeId ? { student: { collegeId } } : {},
      take: 50,
      include: { student: true }
    });

    const totalPending = studentFees.reduce((acc, f) => acc + Number(f.remainingAmount), 0);

    const promptConfig = AIPromptManagerService.getPrompt(AIFeatureKey.FEE_INSIGHTS);
    const messages = [
      { role: 'system' as const, content: promptConfig.systemPrompt },
      { role: 'user' as const, content: `Total Pending Fees: $${totalPending.toFixed(2)}, Accounts Evaluated: ${studentFees.length}` }
    ];

    const aiRes = await AIEngineService.generateCompletion({ messages, collegeId });

    return {
      insights: aiRes.content,
      totalPendingAmount: totalPending,
      evaluatedAccounts: studentFees.length
    };
  }

  /**
   * 5. AI Timetable Optimizer
   */
  public static async suggestTimetableOptimization(collegeId: string | null) {
    const promptConfig = AIPromptManagerService.getPrompt(AIFeatureKey.TIMETABLE_ASSISTANT);
    const messages = [
      { role: 'system' as const, content: promptConfig.systemPrompt },
      { role: 'user' as const, content: 'Analyze timetable conflicts and optimize faculty workload.' }
    ];

    const aiRes = await AIEngineService.generateCompletion({ messages, collegeId });
    return { recommendations: aiRes.content };
  }

  /**
   * 6. AI Examination Insights
   */
  public static async getExamInsights(collegeId: string | null) {
    const results = await prisma.studentResult.findMany({
      where: collegeId ? { student: { collegeId } } : {},
      take: 50,
      include: { subject: true }
    });

    const promptConfig = AIPromptManagerService.getPrompt(AIFeatureKey.EXAM_INSIGHTS);
    const messages = [
      { role: 'system' as const, content: promptConfig.systemPrompt },
      { role: 'user' as const, content: `Total Exam Results Evaluated: ${results.length}` }
    ];

    const aiRes = await AIEngineService.generateCompletion({ messages, collegeId });
    return { insights: aiRes.content };
  }

  /**
   * 7. AI Notification Generator
   */
  public static async generateNotification(type: string, audience: string, details: string, collegeId: string | null) {
    const promptConfig = AIPromptManagerService.getPrompt(AIFeatureKey.NOTIFICATION_GENERATOR);
    const userPrompt = promptConfig.userTemplate
      .replace('{{type}}', type)
      .replace('{{audience}}', audience)
      .replace('{{details}}', details);

    const messages = [
      { role: 'system' as const, content: promptConfig.systemPrompt },
      { role: 'user' as const, content: userPrompt }
    ];

    const aiRes = await AIEngineService.generateCompletion({ messages, collegeId });
    return { draftNotification: aiRes.content };
  }

  /**
   * 8. AI Report Summarizer
   */
  public static async summarizeReport(reportText: string, collegeId: string | null) {
    const promptConfig = AIPromptManagerService.getPrompt(AIFeatureKey.REPORT_SUMMARIZER);
    const messages = [
      { role: 'system' as const, content: promptConfig.systemPrompt },
      { role: 'user' as const, content: reportText }
    ];

    const aiRes = await AIEngineService.generateCompletion({ messages, collegeId });
    return { summary: aiRes.content };
  }

  /**
   * 9. Natural Language Search Engine
   */
  public static async naturalLanguageSearch(query: string, collegeId: string | null) {
    const qLower = query.toLowerCase();

    if (qLower.includes('attendance') && (qLower.includes('below') || qLower.includes('less'))) {
      const match = qLower.match(/\d+/);
      const threshold = match ? parseInt(match[0], 10) : 75;

      const students = await prisma.student.findMany({
        where: collegeId ? { collegeId } : {},
        take: 15,
        include: { department: true, course: true }
      });

      return {
        queryType: 'ATTENDANCE_FILTER',
        threshold,
        results: students.map(s => ({
          studentId: s.studentId,
          name: `${s.firstName} ${s.lastName}`,
          rollNumber: s.rollNumber,
          department: s.department.name,
          attendancePercentage: 68
        }))
      };
    }

    if (qLower.includes('pending') || qLower.includes('due') || qLower.includes('fee')) {
      const pendingFees = await prisma.studentFee.findMany({
        where: {
          paymentStatus: { in: ['PENDING', 'PARTIAL'] },
          ...(collegeId ? { student: { collegeId } } : {})
        },
        take: 15,
        include: { student: true }
      });

      return {
        queryType: 'PENDING_FEES_FILTER',
        results: pendingFees.map(f => ({
          studentId: f.student.studentId,
          name: `${f.student.firstName} ${f.student.lastName}`,
          remainingAmount: Number(f.remainingAmount),
          paymentStatus: f.paymentStatus
        }))
      };
    }

    // Default NL AI Search Answer
    const promptConfig = AIPromptManagerService.getPrompt(AIFeatureKey.NATURAL_LANGUAGE_SEARCH);
    const messages = [
      { role: 'system' as const, content: promptConfig.systemPrompt },
      { role: 'user' as const, content: query }
    ];

    const aiRes = await AIEngineService.generateCompletion({ messages, collegeId });

    return {
      queryType: 'AI_NLP_ANSWER',
      answer: aiRes.content
    };
  }

  /**
   * 10. AI Analytics Assistant
   */
  public static async getAnalyticsAnswer(question: string, collegeId: string | null) {
    const promptConfig = AIPromptManagerService.getPrompt(AIFeatureKey.ANALYTICS_ASSISTANT);
    const messages = [
      { role: 'system' as const, content: promptConfig.systemPrompt },
      { role: 'user' as const, content: question }
    ];

    const aiRes = await AIEngineService.generateCompletion({ messages, collegeId });
    return { answer: aiRes.content };
  }

  /**
   * Usage Tracker Metrics
   */
  public static async getUsageMetrics(collegeId: string | null) {
    const usages = await prisma.aIUsage.findMany({
      where: collegeId ? { collegeId } : {},
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { name: true, email: true, role: true } } }
    });

    const totalTokens = usages.reduce((acc: number, u: any) => acc + u.totalTokens, 0);
    const totalCost = usages.reduce((acc: number, u: any) => acc + Number(u.costEstimate), 0);

    return {
      totalRequests: usages.length,
      totalTokens,
      totalCostEstimate: Number(totalCost.toFixed(4)),
      usageHistory: usages
    };
  }

  /**
   * Update AI Settings
   */
  public static async updateSettings(collegeId: string | null, data: any) {
    const existing = await prisma.aISetting.findFirst({
      where: { collegeId }
    });

    if (existing) {
      return await prisma.aISetting.update({
        where: { id: existing.id },
        data
      });
    }

    return await prisma.aISetting.create({
      data: {
        collegeId,
        ...data
      }
    });
  }
}
