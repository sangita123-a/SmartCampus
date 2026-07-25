import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class HallTicketService {
  async generateHallTicket(studentId: string, examId: string, collegeId: string | null) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        department: true,
        course: true,
        semester: true,
        college: true,
      },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    if (collegeId && student.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        examSubjects: {
          include: {
            subject: true,
          },
          orderBy: { examDate: 'asc' },
        },
      },
    });

    if (!exam) {
      throw new AppError('Exam schedule not found', 404);
    }

    return {
      student,
      exam,
      schedule: exam.examSubjects.map((es) => ({
        subjectCode: es.subject.subjectCode,
        subjectName: es.subject.subjectName,
        examDate: es.examDate,
        startTime: es.startTime,
        endTime: es.endTime,
        maxMarks: Number(es.maxMarks),
      })),
    };
  }
}

export const hallTicketService = new HallTicketService();
