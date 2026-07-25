import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class PublisherService {
  async listPublishers() {
    return prisma.publisher.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { books: true } } },
    });
  }

  async createPublisher(data: any) {
    const existing = await prisma.publisher.findUnique({ where: { name: data.name } });
    if (existing) throw new AppError(`Publisher "${data.name}" already exists`, 400);

    return prisma.publisher.create({ data });
  }
}

export const publisherService = new PublisherService();
