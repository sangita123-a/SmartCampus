export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'NET_BANKING' | 'CHEQUE' | 'ONLINE_GATEWAY';
export type AcademicStatus = 'ACTIVE' | 'INACTIVE';

export interface FeeCategory {
  id: string;
  collegeId: string;
  name: string;
  description?: string;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FeeStructure {
  id: string;
  collegeId: string;
  departmentId: string;
  courseId: string;
  semesterId: string;
  feeCategoryId: string;
  academicYear: string;
  amount: number;
  dueDate: string;
  lateFeePerDay: number;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  department?: { id: string; name: string; code: string };
  course?: { id: string; name: string; code: string };
  semester?: { id: string; name: string; semesterNumber: number };
  feeCategory?: { id: string; name: string };
}

export interface PaymentRecord {
  id: string;
  studentFeeId: string;
  receiptNumber: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  amount: number;
  paymentDate: string;
  paymentStatus: PaymentStatus;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  studentFee?: StudentFeeRecord;
}

export interface StudentFeeRecord {
  id: string;
  studentId: string;
  feeStructureId: string;
  totalAmount: number;
  discountAmount: number;
  scholarshipAmount: number;
  fineAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    studentId: string;
    email: string;
    department?: { name: string };
    course?: { name: string };
    semester?: { name: string };
    college?: { name: string; logo?: string; address?: string };
  };
  feeStructure?: FeeStructure;
  payments?: PaymentRecord[];
}

export interface FinanceDashboardCardsData {
  todayCollection: number;
  monthlyCollection: number;
  totalRevenue: number;
  pendingFees: number;
  overdueFees: number;
  studentsWithPendingFees: number;
}

export interface CollectPaymentPayload {
  studentFeeId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  discountAmount?: number;
  scholarshipAmount?: number;
  remarks?: string;
}
