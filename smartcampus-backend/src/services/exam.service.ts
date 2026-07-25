import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class ExamService {
  async listExams(collegeId: string | null, query: any) {
    const { page = 1, limit = 10, search, departmentId, courseId, semesterId, examType, status, isPublished } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ExamWhereInput = {
      ...(collegeId ? { collegeId } : {}),
      ...(departmentId ? { departmentId } : {}),
      ...(courseId ? { courseId } : {}),
      ...(semesterId ? { semesterId } : {}),
      ...(examType ? { examType } : {}),
      ...(status ? { status } : {}),
      ...(isPublished !== undefined ? { isPublished } : {}),
      ...(search
        ? {
            OR: [
              { examName: { contains: search, mode: 'insensitive' } },
              { course: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: {
          department: { select: { id: true, name: true, code: true } },
          course: { select: { id: true, name: true, code: true } },
          semester: { select: { id: true, name: true, semesterNumber: true } },
          examSubjects: {
            include: {
              subject: { select: { id: true, subjectCode: true, subjectName: true, credits: true } },
              faculty: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
      }),
      prisma.exam.count({ where }),
    ]);

    return {
      exams,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getExamById(id: string, collegeId: string | null) {
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        department: true,
        course: true,
        semester: true,
        examSubjects: {
          include: {
            subject: true,
            faculty: true,
          },
          orderBy: { examDate: 'asc' },
        },
      },
    });

    if (!exam) {
      throw new AppError('Exam schedule not found', 404);
    }

    if (collegeId && exam.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    return exam;
  }

  async createExam(collegeId: string, data: any) {
    const targetCollegeId = collegeId || data.collegeId;
    if (!targetCollegeId) {
      throw new AppError('College ID is required', 400);
    }

    const { departmentId, courseId, semesterId, examName, examType, academicYear = '2025-2026', startDate, endDate, status } = data;

    const existing = await prisma.exam.findUnique({
      where: {
        collegeId_semesterId_examName_academicYear: {
          collegeId: targetCollegeId,
          semesterId,
          examName,
          academicYear,
        },
      },
    });

    if (existing) {
      throw new AppError(`Exam "${examName}" already exists for this semester in ${academicYear}`, 400);
    }

    return prisma.exam.create({
      data: {
        collegeId: targetCollegeId,
        departmentId,
        courseId,
        semesterId,
        examName,
        examType,
        academicYear,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
      },
      include: {
        department: true,
        course: true,
        semester: true,
      },
    });
  }

  async updateExam(id: string, collegeId: string | null, data: any) {
    await this.getExamById(id, collegeId);

    return prisma.exam.update({
      where: { id },
      data: {
        ...data,
        ...(data.startDate ? { startDate: new Date(data.startDate) } : {}),
        ...(data.endDate ? { endDate: new Date(data.endDate) } : {}),
      },
      include: {
        department: true,
        course: true,
        semester: true,
      },
    });
  }

  async deleteExam(id: string, collegeId: string | null) {
    await this.getExamById(id, collegeId);
    return prisma.exam.delete({ where: { id } });
  }

  async addExamSubject(collegeId: string | null, data: any) {
    const { examId, subjectId, facultyId, maxMarks = 100, passingMarks = 40, examDate, startTime, endTime } = data;

    const exam = await this.getExamById(examId, collegeId);

    if (passingMarks > maxMarks) {
      throw new AppError('Passing marks cannot exceed maximum marks', 400);
    }

    const existing = await prisma.examSubject.findUnique({
      where: {
        examId_subjectId: {
          examId,
          subjectId,
        },
      },
    });

    if (existing) {
      throw new AppError('Subject is already scheduled for this exam', 400);
    }

    return prisma.examSubject.create({
      data: {
        examId: exam.id,
        subjectId,
        facultyId: facultyId || null,
        maxMarks,
        passingMarks,
        examDate: new Date(examDate),
        startTime,
        endTime,
      },
      include: {
        subject: true,
        faculty: true,
      },
    });
  }

  async removeExamSubject(examSubjectId: string, collegeId: string | null) {
    const examSubject = await prisma.examSubject.findUnique({
      where: { id: examSubjectId },
      include: { exam: true },
    });

    if (!examSubject) {
      throw new AppError('Exam subject not found', 404);
    }

    if (collegeId && examSubject.exam.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    return prisma.examSubject.delete({ where: { id: examSubjectId } });
  }
}

export const examService = new ExamService();
