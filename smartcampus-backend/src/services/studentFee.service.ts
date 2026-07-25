import { PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export class StudentFeeService {
  async generateSemesterFees(collegeId: string | null, feeStructureId: string) {
    const structure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
    });

    if (!structure) {
      throw new AppError('Fee structure not found', 404);
    }

    if (collegeId && structure.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    // Find all active students in department/course/semester
    const students = await prisma.student.findMany({
      where: {
        collegeId: structure.collegeId,
        departmentId: structure.departmentId,
        courseId: structure.courseId,
        semesterId: structure.semesterId,
        status: 'ACTIVE',
      },
    });

    if (students.length === 0) {
      throw new AppError('No active students found matching this fee structure section', 404);
    }

    let generatedCount = 0;

    for (const student of students) {
      const existing = await prisma.studentFee.findUnique({
        where: {
          studentId_feeStructureId: {
            studentId: student.id,
            feeStructureId: structure.id,
          },
        },
      });

      if (!existing) {
        const total = Number(structure.amount);
        await prisma.studentFee.create({
          data: {
            studentId: student.id,
            feeStructureId: structure.id,
            totalAmount: total,
            discountAmount: 0,
            scholarshipAmount: 0,
            fineAmount: 0,
            paidAmount: 0,
            remainingAmount: total,
            paymentStatus: PaymentStatus.PENDING,
          },
        });
        generatedCount++;
      }
    }

    return {
      message: `Generated fee records for ${generatedCount} students (${students.length - generatedCount} already existed)`,
      generatedCount,
      totalStudents: students.length,
    };
  }

  async listStudentFees(collegeId: string | null, query: any) {
    const { page = 1, limit = 10, search, studentId, feeStructureId, paymentStatus } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.StudentFeeWhereInput = {
      ...(studentId ? { studentId } : {}),
      ...(feeStructureId ? { feeStructureId } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
      ...(collegeId ? { student: { collegeId } } : {}),
      ...(search
        ? {
            OR: [
              { student: { firstName: { contains: search, mode: 'insensitive' } } },
              { student: { lastName: { contains: search, mode: 'insensitive' } } },
              { student: { rollNumber: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [fees, total] = await Promise.all([
      prisma.studentFee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
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
          feeStructure: {
            include: {
              feeCategory: { select: { name: true } },
              course: { select: { name: true } },
              semester: { select: { name: true } },
            },
          },
          payments: true,
        },
      }),
      prisma.studentFee.count({ where }),
    ]);

    // Recalculate late fine dynamically based on today's date if overdue
    const updatedFees = fees.map((f) => {
      const dueDate = new Date(f.feeStructure.dueDate);
      const today = new Date();
      let calculatedFine = Number(f.fineAmount);

      if (today > dueDate && f.paymentStatus !== PaymentStatus.PAID) {
        const diffDays = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
        const lateFeePerDay = Number(f.feeStructure.lateFeePerDay || 0);
        calculatedFine = Math.max(calculatedFine, diffDays * lateFeePerDay);
      }

      const totalEffective = Number(f.totalAmount) - Number(f.discountAmount) - Number(f.scholarshipAmount) + calculatedFine;
      const remaining = Math.max(0, totalEffective - Number(f.paidAmount));

      let currentStatus: PaymentStatus = f.paymentStatus;
      if (remaining === 0 && Number(f.paidAmount) > 0) {
        currentStatus = PaymentStatus.PAID;
      } else if (today > dueDate && remaining > 0 && Number(f.paidAmount) === 0) {
        currentStatus = PaymentStatus.OVERDUE;
      } else if (Number(f.paidAmount) > 0 && remaining > 0) {
        currentStatus = PaymentStatus.PARTIAL;
      }

      return {
        ...f,
        fineAmount: calculatedFine,
        remainingAmount: remaining,
        paymentStatus: currentStatus,
      };
    });

    return {
      fees: updatedFees,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStudentFeeById(id: string, collegeId: string | null) {
    const fee = await prisma.studentFee.findUnique({
      where: { id },
      include: {
        student: true,
        feeStructure: {
          include: {
            department: true,
            course: true,
            semester: true,
            feeCategory: true,
          },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    if (!fee) {
      throw new AppError('Student fee record not found', 404);
    }

    if (collegeId && fee.student.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    return fee;
  }

  async getStudentLedger(studentId: string, collegeId: string | null) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { department: true, course: true, semester: true },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    if (collegeId && student.collegeId !== collegeId) {
      throw new AppError('Access denied', 403);
    }

    const feeRecords = await prisma.studentFee.findMany({
      where: { studentId },
      include: {
        feeStructure: {
          include: { feeCategory: true },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    const totalFeesAssigned = feeRecords.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
    const totalDiscounts = feeRecords.reduce((acc, curr) => acc + Number(curr.discountAmount) + Number(curr.scholarshipAmount), 0);
    const totalPaid = feeRecords.reduce((acc, curr) => acc + Number(curr.paidAmount), 0);
    const totalOutstanding = feeRecords.reduce((acc, curr) => acc + Number(curr.remainingAmount), 0);

    return {
      student,
      summary: {
        totalFeesAssigned,
        totalDiscounts,
        totalPaid,
        totalOutstanding,
      },
      feeRecords,
    };
  }
}

export const studentFeeService = new StudentFeeService();
