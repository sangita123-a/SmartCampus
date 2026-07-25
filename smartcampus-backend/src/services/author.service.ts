import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class AuthorService {
  async listAuthors() {
    return prisma.author.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { books: true } } },
    });
  }

  async createAuthor(data: any) {
    const existing = await prisma.author.findUnique({ where: { name: data.name } });
    if (existing) throw new AppError(`Author "${data.name}" already exists`, 400);

    return prisma.author.create({ data });
  }
}

export const authorService = new AuthorService();
