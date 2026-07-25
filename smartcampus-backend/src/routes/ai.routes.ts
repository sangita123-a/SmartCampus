import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Protect all AI routes with authentication
router.use(authenticate);

// Chatbot
router.post('/chat', AIController.chat);

// Predictive Analytics & Insights
router.get('/performance-prediction', AIController.predictPerformance);
router.get('/attendance-insights', AIController.getAttendanceInsights);
router.get('/fee-insights', AIController.getFeeInsights);
router.get('/timetable-optimization', AIController.suggestTimetable);
router.get('/exam-insights', AIController.getExamInsights);

// Generative Tools
router.post('/generate-notification', AIController.generateNotification);
router.post('/summarize-report', AIController.summarizeReport);

// Natural Language Search & Analytics Q&A
router.post('/search', AIController.naturalLanguageSearch);
router.post('/analytics-answer', AIController.getAnalyticsAnswer);

// Metrics & Settings
router.get('/usage', AIController.getUsageMetrics);
router.get('/settings', AIController.getSettings);
router.put('/settings', AIController.updateSettings);

export default router;
