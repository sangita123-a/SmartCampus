import { ExamStatus, ResultStatus } from '@prisma/client';
import { prisma } from '../config/database';

export class ExamDashboardService {
  async getDashboardCards(collegeId: string | null) {
    const whereCollege = collegeId ? { collegeId } : {};

    const [
      upcomingExams,
      completedExams,
      publishedResultsCount,
      pendingResultsCount,
      passResultsCount,
      failResultsCount,
    ] = await Promise.all([
      // Upcoming Exams
      prisma.exam.count({
        where: {
          ...whereCollege,
          status: ExamStatus.SCHEDULED,
        },
      }),

      // Completed Exams
      prisma.exam.count({
        where: {
          ...whereCollege,
          status: ExamStatus.COMPLETED,
        },
      }),

      // Published Results
      prisma.exam.count({
        where: {
          ...whereCollege,
          isPublished: true,
        },
      }),

      // Pending Results
      prisma.exam.count({
        where: {
          ...whereCollege,
          isPublished: false,
          status: ExamStatus.COMPLETED,
        },
      }),

      // Pass Results Count
      prisma.studentResult.count({
        where: {
          resultStatus: ResultStatus.PASS,
          ...(collegeId ? { exam: { collegeId } } : {}),
        },
      }),

      // Fail Results Count
      prisma.studentResult.count({
        where: {
          resultStatus: ResultStatus.FAIL,
          ...(collegeId ? { exam: { collegeId } } : {}),
        },
      }),
    ]);

    const totalResultsEvaluated = passResultsCount + failResultsCount;
    const passPercentage = totalResultsEvaluated > 0 ? Number(((passResultsCount / totalResultsEvaluated) * 100).toFixed(2)) : 0;
    const failPercentage = totalResultsEvaluated > 0 ? Number(((failResultsCount / totalResultsEvaluated) * 100).toFixed(2)) : 0;

    return {
      upcomingExams,
      completedExams,
      publishedResults: publishedResultsCount,
      pendingResults: pendingResultsCount,
      passPercentage,
      failPercentage,
      totalResultsEvaluated,
    };
  }
}

export const examDashboardService = new ExamDashboardService();
