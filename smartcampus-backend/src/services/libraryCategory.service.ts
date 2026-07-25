import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class LibraryCategoryService {
  async listCategories(collegeId: string | null) {
    return prisma.bookCategory.findMany({
      where: collegeId ? { collegeId } : {},
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { books: true } },
      },
    });
  }

  async createCategory(collegeId: string, data: any) {
    const targetCollegeId = collegeId || data.collegeId;
    if (!targetCollegeId) {
      throw new AppError('College ID is required', 400);
    }

    const existing = await prisma.bookCategory.findUnique({
      where: {
        collegeId_name: {
          collegeId: targetCollegeId,
          name: data.name,
        },
      },
    });

    if (existing) {
      throw new AppError(`Category "${data.name}" already exists`, 400);
    }

    return prisma.bookCategory.create({
      data: {
        collegeId: targetCollegeId,
        name: data.name,
        description: data.description || null,
      },
    });
  }

  async deleteCategory(id: string, collegeId: string | null) {
    const category = await prisma.bookCategory.findUnique({ where: { id } });
    if (!category) throw new AppError('Category not found', 404);
    if (collegeId && category.collegeId !== collegeId) throw new AppError('Access denied', 403);

    return prisma.bookCategory.delete({ where: { id } });
  }
}

export const libraryCategoryService = new LibraryCategoryService();
