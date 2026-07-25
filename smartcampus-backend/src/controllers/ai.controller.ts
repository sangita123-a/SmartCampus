import { Request, Response, NextFunction } from 'express';
import { AISmartCampusService } from '../services/aiSmartCampus.service';
import { AIEngineService } from '../services/aiEngine.service';

export class AIController {
  // Chatbot
  public static async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const { conversationId, message } = req.body;
      if (!message) {
        res.status(400).json({ success: false, message: 'Message content is required' });
        return;
      }
      const result = await AISmartCampusService.chat(user.id, user.collegeId, conversationId, message);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Performance Prediction
  public static async predictPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const result = await AISmartCampusService.predictStudentPerformance(user.collegeId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Attendance Insights
  public static async getAttendanceInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const result = await AISmartCampusService.getAttendanceInsights(user.collegeId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Fee Insights
  public static async getFeeInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const result = await AISmartCampusService.getFeeInsights(user.collegeId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Timetable Optimization
  public static async suggestTimetable(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const result = await AISmartCampusService.suggestTimetableOptimization(user.collegeId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Exam Insights
  public static async getExamInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const result = await AISmartCampusService.getExamInsights(user.collegeId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Generate Notification
  public static async generateNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const { type, audience, details } = req.body;
      const result = await AISmartCampusService.generateNotification(type, audience, details, user.collegeId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Summarize Report
  public static async summarizeReport(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const { reportText } = req.body;
      const result = await AISmartCampusService.summarizeReport(reportText, user.collegeId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Natural Language Search
  public static async naturalLanguageSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const { query } = req.body;
      if (!query) {
        res.status(400).json({ success: false, message: 'Search query is required' });
        return;
      }
      const result = await AISmartCampusService.naturalLanguageSearch(query, user.collegeId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Analytics Assistant Answer
  public static async getAnalyticsAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const { question } = req.body;
      const result = await AISmartCampusService.getAnalyticsAnswer(question, user.collegeId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Usage Tracker
  public static async getUsageMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const result = await AISmartCampusService.getUsageMetrics(user.role === 'SUPER_ADMIN' ? null : user.collegeId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Get Settings
  public static async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const settings = await AIEngineService.getSettings(user.role === 'SUPER_ADMIN' ? null : user.collegeId);
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }

  // Update Settings
  public static async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const settings = await AISmartCampusService.updateSettings(user.role === 'SUPER_ADMIN' ? null : user.collegeId, req.body);
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }
}
