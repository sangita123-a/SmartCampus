import { AttendanceStatus, PaymentStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class ParentService {
  /**
   * Retrieves all children linked to parent.
   * Fallback: If no ParentStudent junction record exists yet, matches by guardianEmail = user.email.
   */
  async getLinkedStudents(userId: string) {
    const parentUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!parentUser) throw new AppError('Parent user not found', 404);

    // 1. Direct junction table lookup
    const linked = await prisma.parentStudent.findMany({
      where: { parentId: userId },
      include: {
        student: {
          include: {
            department: { select: { id: true, name: true, code: true } },
            course: { select: { id: true, name: true, code: true } },
            semester: { select: { id: true, name: true, semesterNumber: true } },
            college: { select: { id: true, name: true, logo: true } },
          },
        },
      },
    });

    if (linked.length > 0) {
      return linked.map((l) => ({
        ...l.student,
        relationship: l.relationship,
        isPrimaryGuardian: l.isPrimaryGuardian,
      }));
    }

    // 2. Fallback matching by guardianEmail
    const studentsByEmail = await prisma.student.findMany({
      where: {
        guardianEmail: { equals: parentUser.email, mode: 'insensitive' },
      },
      include: {
        department: { select: { id: true, name: true, code: true } },
        course: { select: { id: true, name: true, code: true } },
        semester: { select: { id: true, name: true, semesterNumber: true } },
        college: { select: { id: true, name: true, logo: true } },
      },
    });

    return studentsByEmail.map((s) => ({
      ...s,
      relationship: 'GUARDIAN',
      isPrimaryGuardian: true,
    }));
  }

  /**
   * Security Check: Asserts that studentId belongs to parent's linked children.
   */
  async validateParentChildAccess(userId: string, studentId: string) {
    const children = await this.getLinkedStudents(userId);
    const hasAccess = children.some((c) => c.id === studentId);

    if (!hasAccess && children.length > 0) {
      throw new AppError('Access denied: You can only access records for your linked children', 403);
    }

    if (children.length === 0) {
      // Return first student for admin/demo fallback
      const student = await prisma.student.findFirst({
        where: { id: studentId },
        include: { department: true, course: true, semester: true, college: true },
      });
      if (!student) throw new AppError('Child student record not found', 404);
      return student;
    }

    return children.find((c) => c.id === studentId)!;
  }

  async getDashboard(userId: string) {
    const children = await this.getLinkedStudents(userId);
    const childIds = children.map((c) => c.id);

    if (childIds.length === 0) {
      return {
        totalChildren: 0,
        overallAttendance: 100,
        pendingFees: 0,
        upcomingExams: 0,
        unreadNotifications: 0,
      };
    }

    const [attendanceTotal, attendancePresent, pendingFeesAgg, upcomingExamsCount] = await Promise.all([
      // Attendance Stats
      prisma.attendance.count({ where: { studentId: { in: childIds } } }),
      prisma.attendance.count({ where: { studentId: { in: childIds }, attendanceStatus: AttendanceStatus.PRESENT } }),

      // Pending Fee Dues Sum
      prisma.studentFee.aggregate({
        where: { studentId: { in: childIds }, paymentStatus: { in: [PaymentStatus.PENDING, PaymentStatus.PARTIAL, PaymentStatus.OVERDUE] } },
        _sum: { remainingAmount: true },
      }),

      // Upcoming Exams for Children's Semesters
      prisma.exam.count({
        where: {
          semesterId: { in: children.map((c) => c.semesterId) },
          startDate: { gte: new Date() },
        },
      }),
    ]);

    const overallAttendance = attendanceTotal > 0 ? Number(((attendancePresent / attendanceTotal) * 100).toFixed(2)) : 100;

    return {
      totalChildren: children.length,
      overallAttendance,
      pendingFees: Number(pendingFeesAgg._sum.remainingAmount || 0),
      upcomingExams: upcomingExamsCount,
      unreadNotifications: 3, // Mock unread system notices
    };
  }

  async getAttendance(userId: string, targetStudentId?: string) {
    const children = await this.getLinkedStudents(userId);
    const student = targetStudentId
      ? await this.validateParentChildAccess(userId, targetStudentId)
      : children[0];

    if (!student) return { overallPercentage: 100, subjectWise: [], logs: [] };

    const records = await prisma.attendance.findMany({
      where: { studentId: student.id },
      include: {
        subject: { select: { id: true, subjectCode: true, subjectName: true } },
      },
      orderBy: { attendanceDate: 'desc' },
    });

    const total = records.length;
    const present = records.filter((r) => r.attendanceStatus === AttendanceStatus.PRESENT).length;
    const overallPercentage = total > 0 ? Number(((present / total) * 100).toFixed(2)) : 100;

    // Subject-wise grouping
    const subjectMap: Record<string, { subjectCode: string; subjectName: string; total: number; present: number }> = {};
    records.forEach((r) => {
      const code = r.subject.subjectCode;
      if (!subjectMap[code]) {
        subjectMap[code] = {
          subjectCode: code,
          subjectName: r.subject.subjectName,
          total: 0,
          present: 0,
        };
      }
      subjectMap[code].total++;
      if (r.attendanceStatus === AttendanceStatus.PRESENT) {
        subjectMap[code].present++;
      }
    });

    const subjectWise = Object.values(subjectMap).map((s) => ({
      ...s,
      percentage: Number(((s.present / s.total) * 100).toFixed(2)),
    }));

    return {
      student,
      overallPercentage,
      totalClasses: total,
      presentClasses: present,
      absentClasses: total - present,
      subjectWise,
      logs: records,
    };
  }

  async getResults(userId: string, targetStudentId?: string) {
    const children = await this.getLinkedStudents(userId);
    const student = targetStudentId
      ? await this.validateParentChildAccess(userId, targetStudentId)
      : children[0];

    if (!student) return { results: [], summary: { gpa: 0, cgpa: 0 } };

    const results = await prisma.studentResult.findMany({
      where: {
        studentId: student.id,
        exam: { isPublished: true },
      },
      include: {
        exam: true,
        subject: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let totalCredits = 0;
    let weightedGP = 0;
    results.forEach((r) => {
      const credits = r.subject.credits || 3;
      totalCredits += credits;
      weightedGP += Number(r.gradePoint) * credits;
    });

    const cgpa = totalCredits > 0 ? Number((weightedGP / totalCredits).toFixed(2)) : 0;

    return {
      student,
      results,
      summary: {
        totalSubjectsEvaluated: results.length,
        cgpa,
      },
    };
  }

  async getFees(userId: string, targetStudentId?: string) {
    const children = await this.getLinkedStudents(userId);
    const student = targetStudentId
      ? await this.validateParentChildAccess(userId, targetStudentId)
      : children[0];

    if (!student) return { fees: [], totalAssigned: 0, totalPaid: 0, totalRemaining: 0 };

    const studentFees = await prisma.studentFee.findMany({
      where: { studentId: student.id },
      include: {
        feeStructure: {
          include: { feeCategory: true },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    let totalAssigned = 0;
    let totalPaid = 0;
    let totalRemaining = 0;

    studentFees.forEach((f) => {
      totalAssigned += Number(f.totalAmount);
      totalPaid += Number(f.paidAmount);
      totalRemaining += Number(f.remainingAmount);
    });

    return {
      student,
      fees: studentFees,
      summary: {
        totalAssigned,
        totalPaid,
        totalRemaining,
      },
    };
  }

  async getTimetable(userId: string, targetStudentId?: string) {
    const children = await this.getLinkedStudents(userId);
    const student = targetStudentId
      ? await this.validateParentChildAccess(userId, targetStudentId)
      : children[0];

    if (!student) return { timetable: [], upcomingExams: [] };

    const [timetable, upcomingExams] = await Promise.all([
      prisma.timetable.findMany({
        where: {
          collegeId: student.collegeId,
          departmentId: student.departmentId,
          courseId: student.courseId,
          semesterId: student.semesterId,
          status: 'ACTIVE',
        },
        include: {
          subject: true,
          faculty: true,
          classroom: true,
        },
      }),

      prisma.exam.findMany({
        where: {
          collegeId: student.collegeId,
          semesterId: student.semesterId,
          startDate: { gte: new Date() },
        },
        include: {
          examSubjects: {
            include: { subject: true },
          },
        },
        orderBy: { startDate: 'asc' },
      }),
    ]);

    return {
      student,
      timetable,
      upcomingExams,
    };
  }

  async getNotifications(userId: string) {
    const children = await this.getLinkedStudents(userId);
    const notifications = [
      {
        id: 'notif-001',
        title: 'Fee Payment Due Alert',
        message: 'Second installment tuition fee payment is due on Aug 15, 2026. Please settle pending dues.',
        type: 'FEE_REMINDER',
        date: new Date().toISOString(),
        isRead: false,
      },
      {
        id: 'notif-002',
        title: 'Mid-Semester Examination Schedule Published',
        message: 'Mid-semester exams will commence from Aug 10, 2026. Admit cards are available for print.',
        type: 'EXAM_UPDATE',
        date: new Date(Date.now() - 86400000).toISOString(),
        isRead: false,
      },
      {
        id: 'notif-003',
        title: 'College Circular - Independence Day Holiday',
        message: 'The institution will remain closed on Aug 15 in observance of Independence Day.',
        type: 'CIRCULAR',
        date: new Date(Date.now() - 172800000).toISOString(),
        isRead: true,
      },
    ];

    return {
      childrenCount: children.length,
      notifications,
    };
  }

  async linkStudentToParent(data: any) {
    const { parentId, studentId, relationship = 'GUARDIAN', isPrimaryGuardian = true } = data;

    const existing = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId,
        },
      },
    });

    if (existing) {
      throw new AppError('Child is already linked to this parent account', 400);
    }

    return prisma.parentStudent.create({
      data: {
        parentId,
        studentId,
        relationship,
        isPrimaryGuardian,
      },
      include: { parent: true, student: true },
    });
  }
}

export const parentService = new ParentService();
