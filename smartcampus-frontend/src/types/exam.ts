export type ExamType = 'INTERNAL' | 'MID_SEMESTER' | 'PRACTICAL' | 'LAB' | 'ASSIGNMENT' | 'SEMESTER_END' | 'SUPPLEMENTARY';
export type ExamStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ResultStatus = 'PASS' | 'FAIL' | 'ABSENT' | 'WITHHELD';

export interface ExamSubject {
  id: string;
  examId: string;
  subjectId: string;
  facultyId?: string;
  maxMarks: number;
  passingMarks: number;
  examDate: string;
  startTime: string;
  endTime: string;
  subject?: {
    id: string;
    subjectCode: string;
    subjectName: string;
    credits: number;
  };
  faculty?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface ExamRecord {
  id: string;
  collegeId: string;
  departmentId: string;
  courseId: string;
  semesterId: string;
  examName: string;
  examType: ExamType;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: ExamStatus;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  department?: { id: string; name: string; code: string };
  course?: { id: string; name: string; code: string };
  semester?: { id: string; name: string; semesterNumber: number };
  examSubjects?: ExamSubject[];
}

export interface StudentResultRecord {
  id: string;
  studentId: string;
  examId: string;
  subjectId: string;
  obtainedMarks: number;
  grade: string;
  gradePoint: number;
  resultStatus: ResultStatus;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  subject?: {
    subjectCode: string;
    subjectName: string;
    credits: number;
  };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
  };
}

export interface StudentMarksheetData {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    studentId: string;
    email: string;
    department?: { name: string };
    course?: { name: string };
    semester?: { name: string };
    college?: { name: string; logo?: string };
  };
  exam: ExamRecord;
  subjectBreakdown: {
    subjectCode: string;
    subjectName: string;
    credits: number;
    maxMarks: number;
    passingMarks: number;
    obtainedMarks: number;
    grade: string;
    gradePoint: number;
    resultStatus: ResultStatus;
  }[];
  summary: {
    totalObtainedMarks: number;
    totalMaxMarks: number;
    percentage: string;
    gpa: number;
    cgpa: number;
    overallStatus: ResultStatus;
  };
}

export interface HallTicketData {
  student: {
    firstName: string;
    lastName: string;
    rollNumber: string;
    registrationNumber: string;
    department?: { name: string };
    course?: { name: string };
    semester?: { name: string };
    college?: { name: string; logo?: string };
  };
  exam: ExamRecord;
  schedule: {
    subjectCode: string;
    subjectName: string;
    examDate: string;
    startTime: string;
    endTime: string;
    maxMarks: number;
  }[];
}

export interface RankListItem {
  rank: number;
  studentId: string;
  rollNumber: string;
  studentName: string;
  totalObtained: number;
  totalMax: number;
  percentage: string;
  gpa: number;
  overallStatus: ResultStatus;
}

export interface ExamDashboardCardsData {
  upcomingExams: number;
  completedExams: number;
  publishedResults: number;
  pendingResults: number;
  passPercentage: number;
  failPercentage: number;
  totalResultsEvaluated: number;
}
