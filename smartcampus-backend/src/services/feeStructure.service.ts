import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class FeeStructureService {
  async listStructures(collegeId: string | null, query: any) {
    const { page = 1, limit = 10, search, departmentId, courseId, semesterId, feeCategoryId, academicYear } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.FeeStructureWhereInput = {
      ...(collegeId ? { collegeId } : {}),
      ...(departmentId ? { departmentId } : {}),
      ...(courseId ? { courseId } : {}),
      ...(semesterId ? { semesterId } : {}),
      ...(feeCategoryId ? { feeCategoryId } : {}),
      ...(academicYear ? { academicYear } : {}),
      ...(search
        ? {
            OR: [
              { feeCategory: { name: { contains: search, mode: 'insensitive' } } },
              { course: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [structures, total] = await Promise.all([
      prisma.feeStructure.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          department: { select: { id: true, name: true, code: true } },
          course: { select: { id: true, name: true, code: true } },
          semester: { select: { id: true, name: true, semesterNumber: true } },
          feeCategory: { select: { id: true, name: true } },
        },
      }),
      prisma.feeStructure.count({ where }),
    ]);

    return {
      structures,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStructureById(id: string, collegeId: string | null) {
    const structure = await prisma.feeStructure.findUnique({
      where: { id },
      include: {
        department: true,
        course: true,
        semester: true,
        feeCategory: true,
      },
    });

    if (!structure) {
      throw new AppError('Fee structure not found', 404);
    }

    if (collegeId && structure.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    return structure;
  }

  async createStructure(collegeId: string, data: any) {
    const targetCollegeId = collegeId || data.collegeId;
    if (!targetCollegeId) {
      throw new AppError('College ID is required', 400);
    }

    const { departmentId, courseId, semesterId, feeCategoryId, academicYear = '2025-2026', amount, dueDate, lateFeePerDay = 0 } = data;

    if (amount <= 0) {
      throw new AppError('Fee amount must be greater than 0', 400);
    }

    const existing = await prisma.feeStructure.findUnique({
      where: {
        collegeId_departmentId_courseId_semesterId_feeCategoryId_academicYear: {
          collegeId: targetCollegeId,
          departmentId,
          courseId,
          semesterId,
          feeCategoryId,
          academicYear,
        },
      },
    });

    if (existing) {
      throw new AppError('Fee structure already exists for this semester and fee category in academic year.', 400);
    }

    return prisma.feeStructure.create({
      data: {
        collegeId: targetCollegeId,
        departmentId,
        courseId,
        semesterId,
        feeCategoryId,
        academicYear,
        amount,
        dueDate: new Date(dueDate),
        lateFeePerDay,
      },
      include: {
        department: true,
        course: true,
        semester: true,
        feeCategory: true,
      },
    });
  }

  async updateStructure(id: string, collegeId: string | null, data: any) {
    await this.getStructureById(id, collegeId);

    if (data.amount && data.amount <= 0) {
      throw new AppError('Fee amount must be greater than 0', 400);
    }

    return prisma.feeStructure.update({
      where: { id },
      data: {
        ...data,
        ...(data.dueDate ? { dueDate: new Date(data.dueDate) } : {}),
      },
      include: {
        department: true,
        course: true,
        semester: true,
        feeCategory: true,
      },
    });
  }

  async deleteStructure(id: string, collegeId: string | null) {
    await this.getStructureById(id, collegeId);
    const count = await prisma.studentFee.count({ where: { feeStructureId: id } });

    if (count > 0) {
      throw new AppError('Cannot delete fee structure linked to student fee records', 400);
    }

    return prisma.feeStructure.delete({ where: { id } });
  }
}

export const feeStructureService = new FeeStructureService();
