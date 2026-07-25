import { DayOfWeek, Prisma, TimetableStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { TimetableConflictService } from './timetableConflict.service';

export interface TimetableQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  courseId?: string;
  semesterId?: string;
  subjectId?: string;
  facultyId?: string;
  classroomId?: string;
  dayOfWeek?: DayOfWeek;
  academicYear?: string;
  status?: TimetableStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class TimetableService {
  private conflictService = new TimetableConflictService(prisma);

  async listTimetable(collegeId: string | null, filters: TimetableQueryFilters) {
    const {
      page = 1,
      limit = 50,
      search,
      departmentId,
      courseId,
      semesterId,
      subjectId,
      facultyId,
      classroomId,
      dayOfWeek,
      academicYear,
      status,
      sortBy = 'startTime',
      sortOrder = 'asc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.TimetableWhereInput = {
      ...(collegeId ? { collegeId } : {}),
      ...(departmentId ? { departmentId } : {}),
      ...(courseId ? { courseId } : {}),
      ...(semesterId ? { semesterId } : {}),
      ...(subjectId ? { subjectId } : {}),
      ...(facultyId ? { facultyId } : {}),
      ...(classroomId ? { classroomId } : {}),
      ...(dayOfWeek ? { dayOfWeek } : {}),
      ...(academicYear ? { academicYear } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { subject: { subjectName: { contains: search, mode: 'insensitive' } } },
              { subject: { subjectCode: { contains: search, mode: 'insensitive' } } },
              { faculty: { firstName: { contains: search, mode: 'insensitive' } } },
              { faculty: { lastName: { contains: search, mode: 'insensitive' } } },
              { classroom: { roomNumber: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [timetables, total] = await Promise.all([
      prisma.timetable.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ dayOfWeek: 'asc' }, { [sortBy]: sortOrder }],
        include: {
          department: { select: { id: true, name: true, code: true } },
          course: { select: { id: true, name: true, code: true } },
          semester: { select: { id: true, name: true, semesterNumber: true } },
          subject: { select: { id: true, subjectName: true, subjectCode: true } },
          faculty: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
          classroom: { select: { id: true, roomNumber: true, roomName: true, building: true } },
        },
      }),
      prisma.timetable.count({ where }),
    ]);

    return {
      timetables,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTimetableById(id: string, collegeId: string | null) {
    const entry = await prisma.timetable.findUnique({
      where: { id },
      include: {
        department: true,
        course: true,
        semester: true,
        subject: true,
        faculty: true,
        classroom: true,
      },
    });

    if (!entry) {
      throw new AppError('Timetable slot not found', 404);
    }

    if (collegeId && entry.collegeId !== collegeId) {
      throw new AppError('Access denied for this timetable slot', 403);
    }

    return entry;
  }

  async createTimetable(collegeId: string, data: any) {
    const targetCollegeId = collegeId || data.collegeId;
    if (!targetCollegeId) {
      throw new AppError('College ID is required to schedule a class', 400);
    }

    // Run Conflict Detection
    await this.conflictService.validateNoConflict({
      collegeId: targetCollegeId,
      facultyId: data.facultyId,
      classroomId: data.classroomId,
      courseId: data.courseId,
      semesterId: data.semesterId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
    });

    return prisma.timetable.create({
      data: {
        ...data,
        collegeId: targetCollegeId,
      },
      include: {
        department: true,
        course: true,
        semester: true,
        subject: true,
        faculty: true,
        classroom: true,
      },
    });
  }

  async updateTimetable(id: string, collegeId: string | null, data: any) {
    const existing = await this.getTimetableById(id, collegeId);

    const merged = {
      collegeId: existing.collegeId,
      facultyId: data.facultyId || existing.facultyId,
      classroomId: data.classroomId || existing.classroomId,
      courseId: data.courseId || existing.courseId,
      semesterId: data.semesterId || existing.semesterId,
      dayOfWeek: data.dayOfWeek || existing.dayOfWeek,
      startTime: data.startTime || existing.startTime,
      endTime: data.endTime || existing.endTime,
      excludeTimetableId: id,
    };

    await this.conflictService.validateNoConflict(merged);

    return prisma.timetable.update({
      where: { id },
      data,
      include: {
        department: true,
        course: true,
        semester: true,
        subject: true,
        faculty: true,
        classroom: true,
      },
    });
  }

  async deleteTimetable(id: string, collegeId: string | null) {
    await this.getTimetableById(id, collegeId);
    return prisma.timetable.delete({
      where: { id },
    });
  }

  async getDashboardCards(collegeId: string | null) {
    const whereCollege: Prisma.TimetableWhereInput = collegeId ? { collegeId } : {};

    const daysMap: Record<number, DayOfWeek> = {
      1: DayOfWeek.MONDAY,
      2: DayOfWeek.TUESDAY,
      3: DayOfWeek.WEDNESDAY,
      4: DayOfWeek.THURSDAY,
      5: DayOfWeek.FRIDAY,
      6: DayOfWeek.SATURDAY,
      0: DayOfWeek.SUNDAY,
    };

    const todayEnum = daysMap[new Date().getDay()] || DayOfWeek.MONDAY;

    const [todayCount, weeklyCount, totalClassrooms, occupiedClassrooms, facultyWorkload] =
      await Promise.all([
        prisma.timetable.count({
          where: { ...whereCollege, dayOfWeek: todayEnum, status: 'ACTIVE' },
        }),
        prisma.timetable.count({
          where: { ...whereCollege, status: 'ACTIVE' },
        }),
        prisma.classroom.count({
          where: collegeId ? { collegeId } : {},
        }),
        prisma.timetable.groupBy({
          by: ['classroomId'],
          where: { ...whereCollege, dayOfWeek: todayEnum, status: 'ACTIVE' },
        }),
        prisma.timetable.groupBy({
          by: ['facultyId'],
          where: { ...whereCollege, status: 'ACTIVE' },
          _count: { id: true },
        }),
      ]);

    const occupiedCount = occupiedClassrooms.length;
    const availableCount = Math.max(0, totalClassrooms - occupiedCount);

    return {
      todayClasses: todayCount,
      weeklyClasses: weeklyCount,
      totalClassrooms,
      occupiedClassrooms: occupiedCount,
      availableClassrooms: availableCount,
      totalFacultyAssigned: facultyWorkload.length,
      todayDayOfWeek: todayEnum,
    };
  }

  async getWeeklyView(collegeId: string | null, filters: { semesterId?: string; facultyId?: string; classroomId?: string }) {
    const where: Prisma.TimetableWhereInput = {
      ...(collegeId ? { collegeId } : {}),
      ...(filters.semesterId ? { semesterId: filters.semesterId } : {}),
      ...(filters.facultyId ? { facultyId: filters.facultyId } : {}),
      ...(filters.classroomId ? { classroomId: filters.classroomId } : {}),
      status: 'ACTIVE',
    };

    const entries = await prisma.timetable.findMany({
      where,
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      include: {
        department: { select: { name: true, code: true } },
        course: { select: { name: true, code: true } },
        semester: { select: { name: true, semesterNumber: true } },
        subject: { select: { subjectName: true, subjectCode: true } },
        faculty: { select: { firstName: true, lastName: true } },
        classroom: { select: { roomNumber: true, roomName: true, building: true } },
      },
    });

    const days: DayOfWeek[] = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ];

    const weeklyGrid: Record<string, typeof entries> = {};
    days.forEach((day) => {
      weeklyGrid[day] = entries.filter((e) => e.dayOfWeek === day);
    });

    return {
      entries,
      weeklyGrid,
    };
  }
}

export const timetableService = new TimetableService();
