export interface LinkedStudent {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  registrationNumber: string;
  email: string;
  phone: string;
  gender: string;
  admissionDate: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  relationship?: string;
  isPrimaryGuardian?: boolean;
  department?: { id: string; name: string; code: string };
  course?: { id: string; name: string; code: string };
  semester?: { id: string; name: string; semesterNumber: number };
  college?: { id: string; name: string; logo?: string };
}

export interface ParentDashboardData {
  totalChildren: number;
  overallAttendance: number;
  pendingFees: number;
  upcomingExams: number;
  unreadNotifications: number;
}

export interface SubjectAttendanceItem {
  subjectCode: string;
  subjectName: string;
  total: number;
  present: number;
  percentage: number;
}

export interface ParentAttendanceData {
  student: LinkedStudent;
  overallPercentage: number;
  totalClasses: number;
  presentClasses: number;
  absentClasses: number;
  subjectWise: SubjectAttendanceItem[];
  logs: {
    id: string;
    attendanceDate: string;
    attendanceStatus: string;
    remarks?: string;
    subject: { id: string; subjectCode: string; subjectName: string };
  }[];
}

export interface ParentResultItem {
  id: string;
  obtainedMarks: number;
  grade: string;
  gradePoint: number;
  resultStatus: string;
  exam: { examName: string; academicYear: string };
  subject: { subjectCode: string; subjectName: string; credits: number };
}

export interface ParentResultsData {
  student: LinkedStudent;
  results: ParentResultItem[];
  summary: {
    totalSubjectsEvaluated: number;
    cgpa: number;
  };
}

export interface ParentFeeItem {
  id: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  feeStructure?: {
    academicYear: string;
    dueDate: string;
    feeCategory?: { name: string };
  };
  payments?: {
    id: string;
    receiptNumber: string;
    paymentMethod: string;
    amount: number;
    paymentDate: string;
  }[];
}

export interface ParentFeesData {
  student: LinkedStudent;
  fees: ParentFeeItem[];
  summary: {
    totalAssigned: number;
    totalPaid: number;
    totalRemaining: number;
  };
}

export interface ParentNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  date: string;
  isRead: boolean;
}
