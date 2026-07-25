import { PaymentStatus } from '@prisma/client';
import { prisma } from '../config/database';

export class FinanceDashboardService {
  async getDashboardCards(collegeId: string | null) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const collegeWhere = collegeId ? { studentFee: { student: { collegeId } } } : {};
    const studentFeeCollegeWhere = collegeId ? { student: { collegeId } } : {};

    const [
      todayPayments,
      monthlyPayments,
      totalRevenuePayments,
      pendingFeesList,
      overdueFeesList,
      pendingStudentsCount,
    ] = await Promise.all([
      // Today's Collection
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          ...collegeWhere,
          paymentDate: { gte: todayStart },
        },
      }),

      // Monthly Collection
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          ...collegeWhere,
          paymentDate: { gte: monthStart },
        },
      }),

      // Total Revenue
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: collegeWhere,
      }),

      // Pending Fees sum
      prisma.studentFee.aggregate({
        _sum: { remainingAmount: true },
        where: {
          ...studentFeeCollegeWhere,
          paymentStatus: { in: [PaymentStatus.PENDING, PaymentStatus.PARTIAL] },
        },
      }),

      // Overdue Fees sum
      prisma.studentFee.aggregate({
        _sum: { remainingAmount: true },
        where: {
          ...studentFeeCollegeWhere,
          paymentStatus: PaymentStatus.OVERDUE,
        },
      }),

      // Students with Pending Fees
      prisma.studentFee.groupBy({
        by: ['studentId'],
        where: {
          ...studentFeeCollegeWhere,
          paymentStatus: { in: [PaymentStatus.PENDING, PaymentStatus.PARTIAL, PaymentStatus.OVERDUE] },
        },
      }),
    ]);

    return {
      todayCollection: Number(todayPayments._sum.amount || 0),
      monthlyCollection: Number(monthlyPayments._sum.amount || 0),
      totalRevenue: Number(totalRevenuePayments._sum.amount || 0),
      pendingFees: Number(pendingFeesList._sum.remainingAmount || 0),
      overdueFees: Number(overdueFeesList._sum.remainingAmount || 0),
      studentsWithPendingFees: pendingStudentsCount.length,
    };
  }

  async getCollectionReports(collegeId: string | null) {
    const whereClause = collegeId ? { studentFee: { student: { collegeId } } } : {};

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        studentFee: {
          include: {
            student: {
              include: { department: true, course: true, semester: true },
            },
          },
        },
      },
    });

    const deptMap = new Map<string, number>();
    const courseMap = new Map<string, number>();
    const semMap = new Map<string, number>();

    payments.forEach((p) => {
      const amt = Number(p.amount);
      const deptName = p.studentFee?.student?.department?.name || 'Unknown';
      const courseName = p.studentFee?.student?.course?.name || 'Unknown';
      const semName = p.studentFee?.student?.semester?.name || 'Unknown';

      deptMap.set(deptName, (deptMap.get(deptName) || 0) + amt);
      courseMap.set(courseName, (courseMap.get(courseName) || 0) + amt);
      semMap.set(semName, (semMap.get(semName) || 0) + amt);
    });

    return {
      departmentWise: Array.from(deptMap.entries()).map(([department, total]) => ({ department, total })),
      courseWise: Array.from(courseMap.entries()).map(([course, total]) => ({ course, total })),
      semesterWise: Array.from(semMap.entries()).map(([semester, total]) => ({ semester, total })),
    };
  }
}

export const financeDashboardService = new FinanceDashboardService();
