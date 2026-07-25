import { AttendanceStatus, IssueStatus, PaymentStatus, ResultStatus, StudentStatus } from '@prisma/client';
import { prisma } from '../config/database';

export class ReportService {
  async getDashboardAnalytics(collegeId?: string) {
    if (!collegeId) {
      // Super Admin Platform Overview
      const [totalColleges, activeColleges, expiredColleges, totalStudents, totalFaculty, totalUsers, feeAgg] = await Promise.all([
        prisma.college.count(),
        prisma.college.count({ where: { status: 'ACTIVE' } }),
        prisma.college.count({ where: { status: 'INACTIVE' } }),
        prisma.student.count(),
        prisma.faculty.count(),
        prisma.user.count(),
        prisma.payment.aggregate({
          where: { paymentStatus: PaymentStatus.PAID },
          _sum: { amount: true },
        }),
      ]);

      return {
        role: 'SUPER_ADMIN',
        totalColleges,
        activeColleges,
        expiredColleges,
        totalStudents,
        totalFaculty,
        totalUsers,
        totalRevenue: Number(feeAgg._sum.amount || 0),
        monthlyGrowth: 12.5,
      };
    }

    // College Admin Overview
    const whereCollege = { collegeId };

    const [
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCourses,
      totalSemesters,
      attendanceTotal,
      attendancePresent,
      feePaidAgg,
      feeRemainingAgg,
      totalBooks,
      issuedBooks,
      totalExams,
    ] = await Promise.all([
      prisma.student.count({ where: whereCollege }),
      prisma.faculty.count({ where: whereCollege }),
      prisma.department.count({ where: whereCollege }),
      prisma.course.count({ where: whereCollege }),
      prisma.semester.count({ where: { course: { collegeId } } }),

      prisma.attendance.count({ where: whereCollege }),
      prisma.attendance.count({ where: { ...whereCollege, attendanceStatus: AttendanceStatus.PRESENT } }),

      prisma.payment.aggregate({
        where: { studentFee: { student: { collegeId } }, paymentStatus: PaymentStatus.PAID },
        _sum: { amount: true },
      }),
      prisma.studentFee.aggregate({
        where: { student: { collegeId }, paymentStatus: { in: [PaymentStatus.PENDING, PaymentStatus.PARTIAL, PaymentStatus.OVERDUE] } },
        _sum: { remainingAmount: true },
      }),

      prisma.book.count({ where: whereCollege }),
      prisma.bookIssue.count({ where: { book: { collegeId }, status: IssueStatus.ISSUED } }),
      prisma.exam.count({ where: whereCollege }),
    ]);

    const overallAttendanceRate = attendanceTotal > 0 ? Number(((attendancePresent / attendanceTotal) * 100).toFixed(2)) : 100;

    return {
      role: 'COLLEGE_ADMIN',
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCourses,
      totalSemesters,
      overallAttendanceRate,
      totalRevenueCollected: Number(feePaidAgg._sum.amount || 0),
      pendingFeeDues: Number(feeRemainingAgg._sum.remainingAmount || 0),
      totalBooks,
      issuedBooks,
      totalExams,
    };
  }

  async getStudentReports(params: { collegeId?: string; departmentId?: string; courseId?: string }) {
    const where: any = {};
    if (params.collegeId) where.collegeId = params.collegeId;
    if (params.departmentId) where.departmentId = params.departmentId;
    if (params.courseId) where.courseId = params.courseId;

    const [total, active, graduated, inactive, genderGroups, departmentGroups] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.count({ where: { ...where, status: StudentStatus.ACTIVE } }),
      prisma.student.count({ where: { ...where, status: StudentStatus.GRADUATED } }),
      prisma.student.count({ where: { ...where, status: StudentStatus.INACTIVE } }),

      prisma.student.groupBy({
        by: ['gender'],
        where,
        _count: { _all: true },
      }),

      prisma.department.findMany({
        where: params.collegeId ? { collegeId: params.collegeId } : {},
        select: {
          id: true,
          name: true,
          code: true,
          _count: { select: { students: true } },
        },
      }),
    ]);

    const genderDistribution = genderGroups.map((g) => ({
      gender: g.gender,
      count: g._count._all,
    }));

    const departmentDistribution = departmentGroups.map((d) => ({
      departmentName: d.name,
      departmentCode: d.code,
      studentCount: d._count.students,
    }));

    return {
      summary: { total, active, graduated, inactive },
      genderDistribution,
      departmentDistribution,
    };
  }

  async getFacultyReports(params: { collegeId?: string; departmentId?: string }) {
    const where: any = {};
    if (params.collegeId) where.collegeId = params.collegeId;
    if (params.departmentId) where.departmentId = params.departmentId;

    const [total, fullTime, partTime, contract, departmentGroups, designationGroups] = await Promise.all([
      prisma.faculty.count({ where }),
      prisma.faculty.count({ where: { ...where, employmentType: 'FULL_TIME' } }),
      prisma.faculty.count({ where: { ...where, employmentType: 'PART_TIME' } }),
      prisma.faculty.count({ where: { ...where, employmentType: 'CONTRACT' } }),

      prisma.department.findMany({
        where: params.collegeId ? { collegeId: params.collegeId } : {},
        select: {
          id: true,
          name: true,
          code: true,
          _count: { select: { faculty: true } },
        },
      }),

      prisma.faculty.groupBy({
        by: ['designation'],
        where,
        _count: { _all: true },
      }),
    ]);

    const departmentDistribution = departmentGroups.map((d) => ({
      departmentName: d.name,
      departmentCode: d.code,
      facultyCount: d._count.faculty,
    }));

    const designationDistribution = designationGroups.map((d) => ({
      designation: d.designation,
      count: d._count._all,
    }));

    return {
      summary: { total, fullTime, partTime, contract },
      departmentDistribution,
      designationDistribution,
    };
  }

  async getAttendanceReports(params: { collegeId?: string; departmentId?: string; courseId?: string }) {
    const where: any = {};
    if (params.collegeId) where.collegeId = params.collegeId;
    if (params.departmentId) where.departmentId = params.departmentId;
    if (params.courseId) where.courseId = params.courseId;

    const [totalLogs, presentCount, absentCount, lateCount, leaveCount, subjectLogs] = await Promise.all([
      prisma.attendance.count({ where }),
      prisma.attendance.count({ where: { ...where, attendanceStatus: AttendanceStatus.PRESENT } }),
      prisma.attendance.count({ where: { ...where, attendanceStatus: AttendanceStatus.ABSENT } }),
      prisma.attendance.count({ where: { ...where, attendanceStatus: AttendanceStatus.LATE } }),
      prisma.attendance.count({ where: { ...where, attendanceStatus: AttendanceStatus.LEAVE } }),

      prisma.attendance.findMany({
        where,
        take: 100,
        include: {
          subject: { select: { subjectCode: true, subjectName: true } },
          department: { select: { name: true } },
        },
        orderBy: { attendanceDate: 'desc' },
      }),
    ]);

    const overallPercentage = totalLogs > 0 ? Number(((presentCount / totalLogs) * 100).toFixed(2)) : 100;

    // Subject breakdown
    const subjectMap: Record<string, { subjectCode: string; subjectName: string; total: number; present: number }> = {};
    subjectLogs.forEach((l) => {
      const code = l.subject.subjectCode;
      if (!subjectMap[code]) {
        subjectMap[code] = { subjectCode: code, subjectName: l.subject.subjectName, total: 0, present: 0 };
      }
      subjectMap[code].total++;
      if (l.attendanceStatus === AttendanceStatus.PRESENT) subjectMap[code].present++;
    });

    const subjectWise = Object.values(subjectMap).map((s) => ({
      ...s,
      percentage: Number(((s.present / s.total) * 100).toFixed(2)),
    }));

    return {
      summary: { totalLogs, presentCount, absentCount, lateCount, leaveCount, overallPercentage },
      subjectWise,
    };
  }

  async getFeeReports(params: { collegeId?: string; departmentId?: string }) {
    const whereStudentFee: any = {};
    if (params.collegeId) whereStudentFee.student = { collegeId: params.collegeId };
    if (params.departmentId) whereStudentFee.student = { ...whereStudentFee.student, departmentId: params.departmentId };

    const [assignedAgg, paidAgg, remainingAgg, discountAgg, scholarshipAgg, paymentMethodGroups] = await Promise.all([
      prisma.studentFee.aggregate({ where: whereStudentFee, _sum: { totalAmount: true } }),
      prisma.studentFee.aggregate({ where: whereStudentFee, _sum: { paidAmount: true } }),
      prisma.studentFee.aggregate({ where: whereStudentFee, _sum: { remainingAmount: true } }),
      prisma.studentFee.aggregate({ where: whereStudentFee, _sum: { discountAmount: true } }),
      prisma.studentFee.aggregate({ where: whereStudentFee, _sum: { scholarshipAmount: true } }),

      prisma.payment.groupBy({
        by: ['paymentMethod'],
        where: params.collegeId ? { studentFee: { student: { collegeId: params.collegeId } } } : {},
        _sum: { amount: true },
        _count: { _all: true },
      }),
    ]);

    const paymentMethods = paymentMethodGroups.map((p) => ({
      method: p.paymentMethod,
      count: p._count._all,
      totalAmount: Number(p._sum.amount || 0),
    }));

    return {
      summary: {
        totalAssigned: Number(assignedAgg._sum.totalAmount || 0),
        totalPaid: Number(paidAgg._sum.paidAmount || 0),
        totalRemaining: Number(remainingAgg._sum.remainingAmount || 0),
        totalDiscounts: Number(discountAgg._sum.discountAmount || 0),
        totalScholarships: Number(scholarshipAgg._sum.scholarshipAmount || 0),
      },
      paymentMethods,
    };
  }

  async getExamReports(params: { collegeId?: string; departmentId?: string }) {
    const where: any = {};
    if (params.collegeId) where.student = { collegeId: params.collegeId };
    if (params.departmentId) where.student = { ...where.student, departmentId: params.departmentId };

    const [totalResults, passCount, failCount, gradeGroups, topResults] = await Promise.all([
      prisma.studentResult.count({ where }),
      prisma.studentResult.count({ where: { ...where, resultStatus: ResultStatus.PASS } }),
      prisma.studentResult.count({ where: { ...where, resultStatus: ResultStatus.FAIL } }),

      prisma.studentResult.groupBy({
        by: ['grade'],
        where,
        _count: { _all: true },
      }),

      prisma.studentResult.findMany({
        where: { ...where, resultStatus: ResultStatus.PASS },
        take: 5,
        include: {
          student: { select: { firstName: true, lastName: true, rollNumber: true } },
          exam: { select: { examName: true } },
          subject: { select: { subjectName: true, subjectCode: true } },
        },
        orderBy: { obtainedMarks: 'desc' },
      }),
    ]);

    const passPercentage = totalResults > 0 ? Number(((passCount / totalResults) * 100).toFixed(2)) : 100;

    const gradeDistribution = gradeGroups.map((g) => ({
      grade: g.grade,
      count: g._count._all,
    }));

    const topRankers = topResults.map((r, idx) => ({
      rank: idx + 1,
      studentName: `${r.student.firstName} ${r.student.lastName}`,
      rollNumber: r.student.rollNumber,
      examName: r.exam.examName,
      subject: `${r.subject.subjectName} (${r.subject.subjectCode})`,
      marks: Number(r.obtainedMarks),
      grade: r.grade,
    }));

    return {
      summary: { totalResults, passCount, failCount, passPercentage },
      gradeDistribution,
      topRankers,
    };
  }

  async getLibraryReports(params: { collegeId?: string }) {
    const where: any = params.collegeId ? { collegeId: params.collegeId } : {};

    const [totalBooks, totalCopiesAgg, availableCopiesAgg, totalIssues, currentIssued, returnedCount, categoryGroups, topBorrowed] = await Promise.all([
      prisma.book.count({ where }),
      prisma.book.aggregate({ where, _sum: { totalCopies: true } }),
      prisma.book.aggregate({ where, _sum: { availableCopies: true } }),

      prisma.bookIssue.count({ where: params.collegeId ? { book: { collegeId: params.collegeId } } : {} }),
      prisma.bookIssue.count({ where: { status: IssueStatus.ISSUED, ...(params.collegeId ? { book: { collegeId: params.collegeId } } : {}) } }),
      prisma.bookIssue.count({ where: { status: IssueStatus.RETURNED, ...(params.collegeId ? { book: { collegeId: params.collegeId } } : {}) } }),

      prisma.bookCategory.findMany({
        where,
        select: {
          id: true,
          name: true,
          _count: { select: { books: true } },
        },
      }),

      prisma.book.findMany({
        where,
        take: 5,
        include: {
          author: { select: { name: true } },
          _count: { select: { issues: true } },
        },
        orderBy: { issues: { _count: 'desc' } },
      }),
    ]);

    const categoryDistribution = categoryGroups.map((c) => ({
      categoryName: c.name,
      bookCount: c._count.books,
    }));

    const mostBorrowed = topBorrowed.map((b) => ({
      isbn: b.isbn,
      title: b.title,
      author: b.author.name,
      borrowCount: b._count.issues,
    }));

    return {
      summary: {
        totalBooks,
        totalCopies: Number(totalCopiesAgg._sum.totalCopies || 0),
        availableCopies: Number(availableCopiesAgg._sum.availableCopies || 0),
        totalIssues,
        currentIssued,
        returnedCount,
      },
      categoryDistribution,
      mostBorrowed,
    };
  }
}

export const reportService = new ReportService();
