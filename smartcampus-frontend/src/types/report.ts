export interface DashboardAnalyticsData {
  role: 'SUPER_ADMIN' | 'COLLEGE_ADMIN';
  // Super Admin fields
  totalColleges?: number;
  activeColleges?: number;
  expiredColleges?: number;
  totalUsers?: number;
  totalRevenue?: number;
  monthlyGrowth?: number;
  // College Admin fields
  totalStudents?: number;
  totalFaculty?: number;
  totalDepartments?: number;
  totalCourses?: number;
  totalSemesters?: number;
  overallAttendanceRate?: number;
  totalRevenueCollected?: number;
  pendingFeeDues?: number;
  totalBooks?: number;
  issuedBooks?: number;
  totalExams?: number;
}

export interface StudentReportData {
  summary: {
    total: number;
    active: number;
    graduated: number;
    inactive: number;
  };
  genderDistribution: { gender: string; count: number }[];
  departmentDistribution: { departmentName: string; departmentCode: string; studentCount: number }[];
}

export interface FacultyReportData {
  summary: {
    total: number;
    fullTime: number;
    partTime: number;
    contract: number;
  };
  departmentDistribution: { departmentName: string; departmentCode: string; facultyCount: number }[];
  designationDistribution: { designation: string; count: number }[];
}

export interface AttendanceReportData {
  summary: {
    totalLogs: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    leaveCount: number;
    overallPercentage: number;
  };
  subjectWise: {
    subjectCode: string;
    subjectName: string;
    total: number;
    present: number;
    percentage: number;
  }[];
}

export interface FeeReportData {
  summary: {
    totalAssigned: number;
    totalPaid: number;
    totalRemaining: number;
    totalDiscounts: number;
    totalScholarships: number;
  };
  paymentMethods: {
    method: string;
    count: number;
    totalAmount: number;
  }[];
}

export interface ExamReportData {
  summary: {
    totalResults: number;
    passCount: number;
    failCount: number;
    passPercentage: number;
  };
  gradeDistribution: { grade: string; count: number }[];
  topRankers: {
    rank: number;
    studentName: string;
    rollNumber: string;
    examName: string;
    subject: string;
    marks: number;
    grade: string;
  }[];
}

export interface LibraryReportData {
  summary: {
    totalBooks: number;
    totalCopies: number;
    availableCopies: number;
    totalIssues: number;
    currentIssued: number;
    returnedCount: number;
  };
  categoryDistribution: { categoryName: string; bookCount: number }[];
  mostBorrowed: {
    isbn: string;
    title: string;
    author: string;
    borrowCount: number;
  }[];
}

export interface ReportFilterParams {
  departmentId?: string;
  courseId?: string;
  semesterId?: string;
  academicYear?: string;
}
