export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
export type AttendanceMethod = 'MANUAL' | 'QR_CODE' | 'BIOMETRIC';

export interface AttendanceRecord {
  id: string;
  collegeId: string;
  departmentId: string;
  courseId: string;
  semesterId: string;
  subjectId: string;
  facultyId: string;
  studentId: string;
  attendanceDate: string;
  attendanceStatus: AttendanceStatus;
  attendanceMethod: AttendanceMethod;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  department?: { id: string; name: string; code: string };
  course?: { id: string; name: string; code: string };
  semester?: { id: string; name: string; semesterNumber: number };
  subject?: { id: string; subjectName: string; subjectCode: string };
  faculty?: { id: string; firstName: string; lastName: string; employeeId: string };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    studentId: string;
    email: string;
  };
}

export interface AttendanceDashboardCards {
  todayAttendance: number;
  presentStudents: number;
  absentStudents: number;
  lateStudents: number;
  leaveStudents: number;
  attendancePercentage: number;
}

export interface StudentSubjectAttendance {
  subjectId: string;
  subjectName: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  percentage: number;
}

export interface StudentAttendancePercentageReport {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    studentId: string;
    email: string;
    course?: { name: string };
    semester?: { name: string };
  };
  totalClasses: number;
  totalPresent: number;
  overallPercentage: number;
  subjectBreakdown: StudentSubjectAttendance[];
}

export interface FacultyAttendanceSummaryReport {
  faculty: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    department?: { name: string };
  };
  totalSessionsMarked: number;
  totalRecordsMarked: number;
  averageClassAttendance: number;
}

export interface BulkAttendanceItem {
  studentId: string;
  attendanceStatus: AttendanceStatus;
  remarks?: string;
}

export interface BulkAttendancePayload {
  departmentId: string;
  courseId: string;
  semesterId: string;
  subjectId: string;
  facultyId: string;
  attendanceDate: string;
  attendanceMethod?: AttendanceMethod;
  records: BulkAttendanceItem[];
}

export interface QRSession {
  id: string;
  collegeId: string;
  departmentId: string;
  courseId: string;
  semesterId: string;
  subjectId: string;
  facultyId: string;
  sessionCode: string;
  expiresAt: string;
  isActive: boolean;
}
