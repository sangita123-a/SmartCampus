import { ClassroomStatus, Prisma, RoomType } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export interface ClassroomQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  roomType?: RoomType;
  status?: ClassroomStatus;
  building?: string;
  minCapacity?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ClassroomService {
  async listClassrooms(collegeId: string | null, filters: ClassroomQueryFilters) {
    const {
      page = 1,
      limit = 10,
      search,
      roomType,
      status,
      building,
      minCapacity,
      sortBy = 'roomNumber',
      sortOrder = 'asc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.ClassroomWhereInput = {
      ...(collegeId ? { collegeId } : {}),
      ...(roomType ? { roomType } : {}),
      ...(status ? { status } : {}),
      ...(building ? { building: { contains: building, mode: 'insensitive' } } : {}),
      ...(minCapacity ? { capacity: { gte: minCapacity } } : {}),
      ...(search
        ? {
            OR: [
              { roomNumber: { contains: search, mode: 'insensitive' } },
              { roomName: { contains: search, mode: 'insensitive' } },
              { building: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [classrooms, total] = await Promise.all([
      prisma.classroom.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: { timetables: true },
          },
        },
      }),
      prisma.classroom.count({ where }),
    ]);

    return {
      classrooms,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getClassroomById(id: string, collegeId: string | null) {
    const classroom = await prisma.classroom.findUnique({
      where: { id },
      include: {
        timetables: {
          include: {
            subject: true,
            faculty: true,
            course: true,
            semester: true,
          },
        },
      },
    });

    if (!classroom) {
      throw new AppError('Classroom not found', 404);
    }

    if (collegeId && classroom.collegeId !== collegeId) {
      throw new AppError('Access denied for this classroom', 403);
    }

    return classroom;
  }

  async createClassroom(collegeId: string, data: Prisma.ClassroomCreateInput | any) {
    const targetCollegeId = collegeId || data.collegeId;
    if (!targetCollegeId) {
      throw new AppError('College ID is required to create a classroom', 400);
    }

    const existing = await prisma.classroom.findFirst({
      where: {
        collegeId: targetCollegeId,
        roomNumber: data.roomNumber,
      },
    });

    if (existing) {
      throw new AppError(`Classroom with room number "${data.roomNumber}" already exists`, 400);
    }

    return prisma.classroom.create({
      data: {
        ...data,
        collegeId: targetCollegeId,
      },
    });
  }

  async updateClassroom(id: string, collegeId: string | null, data: any) {
    const classroom = await this.getClassroomById(id, collegeId);

    if (data.roomNumber && data.roomNumber !== classroom.roomNumber) {
      const duplicate = await prisma.classroom.findFirst({
        where: {
          collegeId: classroom.collegeId,
          roomNumber: data.roomNumber,
          id: { not: id },
        },
      });
      if (duplicate) {
        throw new AppError(`Room number "${data.roomNumber}" is already in use`, 400);
      }
    }

    return prisma.classroom.update({
      where: { id },
      data,
    });
  }

  async deleteClassroom(id: string, collegeId: string | null) {
    await this.getClassroomById(id, collegeId);

    // Check if linked to active timetable slots
    const activeSlots = await prisma.timetable.count({
      where: { classroomId: id },
    });

    if (activeSlots > 0) {
      throw new AppError(
        'Cannot delete classroom with existing scheduled timetable slots. Please reassign or delete the timetable entries first.',
        400
      );
    }

    return prisma.classroom.delete({
      where: { id },
    });
  }
}

export const classroomService = new ClassroomService();
