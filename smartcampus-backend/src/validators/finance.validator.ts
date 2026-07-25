import { z } from 'zod';
import { AcademicStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

export const feeCategoryQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  status: z.nativeEnum(AcademicStatus).optional(),
});

export const createFeeCategorySchema = z.object({
  collegeId: z.string().optional(),
  name: z.string({ required_error: 'Fee category name is required' }),
  description: z.string().optional(),
  status: z.nativeEnum(AcademicStatus).optional().default(AcademicStatus.ACTIVE),
});

export const updateFeeCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(AcademicStatus).optional(),
});

export const createFeeStructureSchema = z.object({
  collegeId: z.string().optional(),
  departmentId: z.string({ required_error: 'Department ID is required' }),
  courseId: z.string({ required_error: 'Course ID is required' }),
  semesterId: z.string({ required_error: 'Semester ID is required' }),
  feeCategoryId: z.string({ required_error: 'Fee Category ID is required' }),
  academicYear: z.string().optional().default('2025-2026'),
  amount: z.number().positive({ message: 'Amount must be positive' }),
  dueDate: z.string({ required_error: 'Due date is required' }),
  lateFeePerDay: z.number().min(0).optional().default(0),
  status: z.nativeEnum(AcademicStatus).optional().default(AcademicStatus.ACTIVE),
});

export const updateFeeStructureSchema = z.object({
  departmentId: z.string().optional(),
  courseId: z.string().optional(),
  semesterId: z.string().optional(),
  feeCategoryId: z.string().optional(),
  academicYear: z.string().optional(),
  amount: z.number().positive().optional(),
  dueDate: z.string().optional(),
  lateFeePerDay: z.number().min(0).optional(),
  status: z.nativeEnum(AcademicStatus).optional(),
});

export const generateStudentFeesSchema = z.object({
  collegeId: z.string().optional(),
  feeStructureId: z.string({ required_error: 'Fee Structure ID is required' }),
});

export const collectPaymentSchema = z.object({
  studentFeeId: z.string({ required_error: 'Student Fee ID is required' }),
  amount: z.number().positive({ message: 'Payment amount must be positive' }),
  paymentMethod: z.nativeEnum(PaymentMethod, { required_error: 'Payment method is required' }),
  transactionId: z.string().optional(),
  discountAmount: z.number().min(0).optional().default(0),
  scholarshipAmount: z.number().min(0).optional().default(0),
  remarks: z.string().optional(),
});

export const studentFeeQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  studentId: z.string().optional(),
  feeStructureId: z.string().optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
});

export const paymentQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  studentFeeId: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.string({ required_error: 'ID parameter is required' }),
});
