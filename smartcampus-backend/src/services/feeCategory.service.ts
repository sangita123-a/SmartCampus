import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class FeeCategoryService {
  async listCategories(collegeId: string | null, query: any) {
    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.FeeCategoryWhereInput = {
      ...(collegeId ? { collegeId } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [categories, total] = await Promise.all([
      prisma.feeCategory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.feeCategory.count({ where }),
    ]);

    return {
      categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCategoryById(id: string, collegeId: string | null) {
    const category = await prisma.feeCategory.findUnique({
      where: { id },
      include: { feeStructures: true },
    });

    if (!category) {
      throw new AppError('Fee category not found', 404);
    }

    if (collegeId && category.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    return category;
  }

  async createCategory(collegeId: string, data: any) {
    const targetCollegeId = collegeId || data.collegeId;
    if (!targetCollegeId) {
      throw new AppError('College ID is required', 400);
    }

    const existing = await prisma.feeCategory.findFirst({
      where: {
        collegeId: targetCollegeId,
        name: { equals: data.name, mode: 'insensitive' },
      },
    });

    if (existing) {
      throw new AppError(`Fee category "${data.name}" already exists`, 400);
    }

    return prisma.feeCategory.create({
      data: {
        ...data,
        collegeId: targetCollegeId,
      },
    });
  }

  async updateCategory(id: string, collegeId: string | null, data: any) {
    const category = await this.getCategoryById(id, collegeId);

    if (data.name && data.name.toLowerCase() !== category.name.toLowerCase()) {
      const duplicate = await prisma.feeCategory.findFirst({
        where: {
          collegeId: category.collegeId,
          name: { equals: data.name, mode: 'insensitive' },
          id: { not: id },
        },
      });
      if (duplicate) {
        throw new AppError(`Fee category "${data.name}" already exists`, 400);
      }
    }

    return prisma.feeCategory.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: string, collegeId: string | null) {
    await this.getCategoryById(id, collegeId);
    const count = await prisma.feeStructure.count({ where: { feeCategoryId: id } });

    if (count > 0) {
      throw new AppError('Cannot delete fee category linked to active fee structures', 400);
    }

    return prisma.feeCategory.delete({ where: { id } });
  }
}

export const feeCategoryService = new FeeCategoryService();
