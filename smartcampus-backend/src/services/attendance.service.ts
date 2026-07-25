import { AttendanceMethod, AttendanceStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export interface AttendanceQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  courseId?: string;
  semesterId?: string;
  subjectId?: string;
  facultyId?: string;
  studentId?: string;
  attendanceDate?: string;
  startDate?: string;
  endDate?: string;
  attendanceStatus?: AttendanceStatus;
  attendanceMethod?: AttendanceMethod;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class AttendanceService {
  async listAttendance(collegeId: string | null, filters: AttendanceQueryFilters) {
    const {
      page = 1,
      limit = 10,
      search,
      departmentId,
      courseId,
      semesterId,
      subjectId,
      facultyId,
      studentId,
      attendanceDate,
      startDate,
      endDate,
      attendanceStatus,
      attendanceMethod,
      sortBy = 'attendanceDate',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;

    let dateFilter: Prisma.DateTimeFilter | undefined = undefined;
    if (attendanceDate) {
      const d = new Date(attendanceDate);
      dateFilter = { equals: d };
    } else if (startDate || endDate) {
      dateFilter = {
        ...(startDate ? { gte: new Date(startDate) } : {}),
        ...(endDate ? { lte: new Date(endDate) } : {}),
      };
    }

    const where: Prisma.AttendanceWhereInput = {
      ...(collegeId ? { collegeId } : {}),
      ...(departmentId ? { departmentId } : {}),
      ...(courseId ? { courseId } : {}),
      ...(semesterId ? { semesterId } : {}),
      ...(subjectId ? { subjectId } : {}),
      ...(facultyId ? { facultyId } : {}),
      ...(studentId ? { studentId } : {}),
      ...(attendanceStatus ? { attendanceStatus } : {}),
      ...(attendanceMethod ? { attendanceMethod } : {}),
      ...(dateFilter ? { attendanceDate: dateFilter } : {}),
      ...(search
        ? {
            OR: [
              { student: { firstName: { contains: search, mode: 'insensitive' } } },
              { student: { lastName: { contains: search, mode: 'insensitive' } } },
              { student: { rollNumber: { contains: search, mode: 'insensitive' } } },
              { subject: { subjectName: { contains: search, mode: 'insensitive' } } },
              { faculty: { firstName: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [attendance, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          department: { select: { id: true, name: true, code: true } },
          course: { select: { id: true, name: true, code: true } },
          semester: { select: { id: true, name: true, semesterNumber: true } },
          subject: { select: { id: true, subjectName: true, subjectCode: true } },
          faculty: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              rollNumber: true,
              studentId: true,
              email: true,
            },
          },
        },
      }),
      prisma.attendance.count({ where }),
    ]);

    return {
      attendance,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAttendanceById(id: string, collegeId: string | null) {
    const record = await prisma.attendance.findUnique({
      where: { id },
      include: {
        department: true,
        course: true,
        semester: true,
        subject: true,
        faculty: true,
        student: true,
      },
    });

    if (!record) {
      throw new AppError('Attendance record not found', 404);
    }

    if (collegeId && record.collegeId !== collegeId) {
      throw new AppError('Access denied for this attendance record', 403);
    }

    return record;
  }

  async createAttendance(collegeId: string, data: any) {
    const targetCollegeId = collegeId || data.collegeId;
    if (!targetCollegeId) {
      throw new AppError('College ID is required', 400);
    }

    const attendanceDate = new Date(data.attendanceDate);
    attendanceDate.setHours(0, 0, 0, 0);

    // Prevent duplicate attendance for Student + Subject + Date
    const existing = await prisma.attendance.findUnique({
      where: {
        studentId_subjectId_attendanceDate: {
          studentId: data.studentId,
          subjectId: data.subjectId,
          attendanceDate,
        },
      },
    });

    if (existing) {
      throw new AppError(
        'Attendance record already exists for this student, subject, and date.',
        400
      );
    }

    return prisma.attendance.create({
      data: {
        ...data,
        collegeId: targetCollegeId,
        attendanceDate,
      },
      include: {
        student: true,
        subject: true,
        faculty: true,
      },
    });
  }

  async bulkMarkAttendance(collegeId: string, data: any) {
    const targetCollegeId = collegeId || data.collegeId;
    if (!targetCollegeId) {
      throw new AppError('College ID is required', 400);
    }

    const attendanceDate = new Date(data.attendanceDate);
    attendanceDate.setHours(0, 0, 0, 0);

    const { departmentId, courseId, semesterId, subjectId, facultyId, attendanceMethod = AttendanceMethod.MANUAL, records } = data;

    const results = await prisma.$transaction(
      records.map((rec: { studentId: string; attendanceStatus: AttendanceStatus; remarks?: string }) => {
        return prisma.attendance.upsert({
          where: {
            studentId_subjectId_attendanceDate: {
              studentId: rec.studentId,
              subjectId,
              attendanceDate,
            },
          },
          create: {
            collegeId: targetCollegeId,
            departmentId,
            courseId,
            semesterId,
            subjectId,
            facultyId,
            studentId: rec.studentId,
            attendanceDate,
            attendanceStatus: rec.attendanceStatus,
            attendanceMethod,
            remarks: rec.remarks,
          },
          update: {
            attendanceStatus: rec.attendanceStatus,
            attendanceMethod,
            remarks: rec.remarks,
          },
        });
      })
    );

    return {
      message: `Successfully marked attendance for ${results.length} students`,
      count: results.length,
      attendanceDate,
    };
  }

  async updateAttendance(id: string, collegeId: string | null, data: any) {
    await this.getAttendanceById(id, collegeId);

    return prisma.attendance.update({
      where: { id },
      data,
      include: {
        student: true,
        subject: true,
      },
    });
  }

  async deleteAttendance(id: string, collegeId: string | null) {
    await this.getAttendanceById(id, collegeId);
    return prisma.attendance.delete({ where: { id } });
  }

  async getDashboardCards(collegeId: string | null) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const whereToday: Prisma.AttendanceWhereInput = {
      ...(collegeId ? { collegeId } : {}),
      attendanceDate: today,
    };

    const [todayCount, presentCount, absentCount, lateCount, leaveCount] = await Promise.all([
      prisma.attendance.count({ where: whereToday }),
      prisma.attendance.count({ where: { ...whereToday, attendanceStatus: AttendanceStatus.PRESENT } }),
      prisma.attendance.count({ where: { ...whereToday, attendanceStatus: AttendanceStatus.ABSENT } }),
      prisma.attendance.count({ where: { ...whereToday, attendanceStatus: AttendanceStatus.LATE } }),
      prisma.attendance.count({ where: { ...whereToday, attendanceStatus: AttendanceStatus.LEAVE } }),
    ]);

    const effectivePresent = presentCount + lateCount;
    const attendancePercentage = todayCount > 0 ? Math.round((effectivePresent / todayCount) * 100) : 0;

    return {
      todayAttendance: todayCount,
      presentStudents: presentCount,
      absentStudents: absentCount,
      lateStudents: lateCount,
      leaveStudents: leaveCount,
      attendancePercentage,
    };
  }

  async getStudentPercentage(studentId: string, collegeId: string | null) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { course: true, semester: true, department: true },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    if (collegeId && student.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    const records = await prisma.attendance.findMany({
      where: { studentId },
      include: { subject: true },
    });

    const subjectMap: Record<string, { subjectName: string; total: number; present: number; absent: number; late: number; leave: number }> = {};

    let totalClasses = 0;
    let totalPresent = 0;

    records.forEach((rec) => {
      const subId = rec.subjectId;
      if (!subjectMap[subId]) {
        subjectMap[subId] = {
          subjectName: rec.subject.subjectName,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          leave: 0,
        };
      }
      subjectMap[subId].total += 1;
      totalClasses += 1;

      if (rec.attendanceStatus === AttendanceStatus.PRESENT) {
        subjectMap[subId].present += 1;
        totalPresent += 1;
      } else if (rec.attendanceStatus === AttendanceStatus.LATE) {
        subjectMap[subId].late += 1;
        totalPresent += 1;
      } else if (rec.attendanceStatus === AttendanceStatus.ABSENT) {
        subjectMap[subId].absent += 1;
      } else if (rec.attendanceStatus === AttendanceStatus.LEAVE) {
        subjectMap[subId].leave += 1;
      }
    });

    const subjectBreakdown = Object.keys(subjectMap).map((subId) => {
      const data = subjectMap[subId];
      const percentage = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0;
      return {
        subjectId: subId,
        subjectName: data.subjectName,
        total: data.total,
        present: data.present,
        absent: data.absent,
        late: data.late,
        leave: data.leave,
        percentage,
      };
    });

    const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

    return {
      student,
      totalClasses,
      totalPresent,
      overallPercentage,
      subjectBreakdown,
    };
  }

  async getFacultySummary(facultyId: string, collegeId: string | null) {
    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
      include: { department: true, subjects: true },
    });

    if (!faculty) {
      throw new AppError('Faculty not found', 404);
    }

    if (collegeId && faculty.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    const records = await prisma.attendance.findMany({
      where: { facultyId },
      include: { subject: true },
    });

    const totalSessionsMarked = new Set(records.map((r) => `${r.subjectId}_${r.attendanceDate.toISOString()}`)).size;
    const totalRecords = records.length;
    const presentRecords = records.filter(
      (r) => r.attendanceStatus === AttendanceStatus.PRESENT || r.attendanceStatus === AttendanceStatus.LATE
    ).length;

    const averageClassAttendance = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

    return {
      faculty,
      totalSessionsMarked,
      totalRecordsMarked: totalRecords,
      averageClassAttendance,
    };
  }
}

export const attendanceService = new AttendanceService();
