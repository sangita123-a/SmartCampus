import type { Role } from './roles';

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export type CollegeStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  collegeId: string | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface College {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  logo: string | null;
  status: CollegeStatus;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStart: string;
  subscriptionEnd: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CollegeListResponse {
  items: College[];
  meta: PaginationMeta;
}

export interface CollegeListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CollegeStatus;
  subscriptionPlan?: SubscriptionPlan;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CollegePayload {
  name: string;
  code: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  logo?: string | null;
  status?: CollegeStatus;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStart?: string;
  subscriptionEnd?: string | null;
}

export interface SuperAdminDashboardStats {
  totalColleges: number;
  totalStudents: number;
  totalFaculty: number;
  totalUsers: number;
  activeColleges: number;
  expiredPlans: number;
  recentRegistrations: Array<{
    id: string;
    name: string;
    code: string;
    email: string;
    status: CollegeStatus;
    subscriptionPlan: SubscriptionPlan;
    createdAt: string;
  }>;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
  collegeId?: string | null;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface HealthStatus {
  success: boolean;
  message: string;
}

export type AcademicStatus = 'ACTIVE' | 'INACTIVE';
export type CourseType =
  | 'UNDERGRADUATE'
  | 'POSTGRADUATE'
  | 'DIPLOMA'
  | 'CERTIFICATE'
  | 'OTHER';

export interface Department {
  id: string;
  collegeId: string;
  name: string;
  code: string;
  description: string | null;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  _count?: { courses: number };
}

export interface Course {
  id: string;
  departmentId: string;
  collegeId: string;
  name: string;
  code: string;
  duration: number;
  courseType: CourseType;
  description: string | null;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  department?: { id: string; name: string; code: string };
  _count?: { semesters: number };
}

export interface Semester {
  id: string;
  courseId: string;
  semesterNumber: number;
  name: string;
  startDate: string;
  endDate: string;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: string;
    name: string;
    code: string;
    collegeId: string;
    department: { id: string; name: string; code: string };
  };
}

export interface DepartmentListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AcademicStatus;
  collegeId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CourseListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AcademicStatus;
  courseType?: CourseType;
  departmentId?: string;
  collegeId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SemesterListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AcademicStatus;
  courseId?: string;
  collegeId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface DepartmentPayload {
  name: string;
  code: string;
  description?: string | null;
  status?: AcademicStatus;
  collegeId?: string;
}

export interface CoursePayload {
  departmentId: string;
  name: string;
  code: string;
  duration: number;
  courseType?: CourseType;
  description?: string | null;
  status?: AcademicStatus;
  collegeId?: string;
}

export interface SemesterPayload {
  courseId: string;
  semesterNumber: number;
  name: string;
  startDate: string;
  endDate: string;
  status?: AcademicStatus;
}

export interface CollegeAdminDashboardStats {
  totalDepartments: number;
  totalCourses: number;
  totalSemesters: number;
  activeStudents: number;
  activeFaculty: number;
  college: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'SUSPENDED';
export type BloodGroup =
  | 'A_POS'
  | 'A_NEG'
  | 'B_POS'
  | 'B_NEG'
  | 'AB_POS'
  | 'AB_NEG'
  | 'O_POS'
  | 'O_NEG'
  | 'UNKNOWN';

export interface Student {
  id: string;
  studentId: string;
  collegeId: string;
  departmentId: string;
  courseId: string;
  semesterId: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  bloodGroup: BloodGroup;
  admissionDate: string;
  rollNumber: string;
  registrationNumber: string;
  profileImage: string | null;
  status: StudentStatus;
  guardianName: string | null;
  guardianPhone: string | null;
  guardianEmail: string | null;
  createdAt: string;
  updatedAt: string;
  department?: { id: string; name: string; code: string };
  course?: { id: string; name: string; code: string };
  semester?: { id: string; name: string; semesterNumber: number };
  college?: { id: string; name: string; code: string };
}

export interface StudentListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: StudentStatus;
  gender?: Gender;
  departmentId?: string;
  courseId?: string;
  semesterId?: string;
  collegeId?: string;
  admissionFrom?: string;
  admissionTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StudentPayload {
  departmentId: string;
  courseId: string;
  semesterId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  email: string;
  phone: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  bloodGroup?: BloodGroup;
  admissionDate?: string;
  rollNumber?: string;
  registrationNumber?: string;
  profileImage?: string | null;
  status?: StudentStatus;
  guardianName?: string | null;
  guardianPhone?: string | null;
  guardianEmail?: string | null;
  collegeId?: string;
}

export interface StudentDashboardStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  newAdmissions: number;
  college: { id: string; name: string; code: string } | null;
}

export interface StudentImportResult {
  created: number;
  failed: number;
  errors: Array<{ row: number; message: string }>;
}

export type FacultyStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'VISITING';

export interface Faculty {
  id: string;
  facultyId: string;
  collegeId: string;
  departmentId: string;
  employeeId: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string | null;
  qualification: string | null;
  experience: number;
  designation: string;
  joiningDate: string;
  employmentType: EmploymentType;
  salary: string | null;
  bloodGroup: BloodGroup;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  profileImage: string | null;
  status: FacultyStatus;
  createdAt: string;
  updatedAt: string;
  department?: { id: string; name: string; code: string };
  college?: { id: string; name: string; code: string };
}

export interface FacultyListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: FacultyStatus;
  designation?: string;
  employmentType?: EmploymentType;
  departmentId?: string;
  collegeId?: string;
  recentlyJoined?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FacultyPayload {
  departmentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth?: string | null;
  qualification?: string | null;
  experience?: number;
  designation: string;
  joiningDate?: string;
  employmentType?: EmploymentType;
  salary?: number | null;
  bloodGroup?: BloodGroup;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  profileImage?: string | null;
  status?: FacultyStatus;
  employeeId?: string;
  collegeId?: string;
}

export interface FacultyDashboardStats {
  totalFaculty: number;
  activeFaculty: number;
  inactiveFaculty: number;
  newFaculty: number;
  facultyByDepartment: Array<{
    departmentId: string;
    departmentName: string;
    count: number;
  }>;
  college: { id: string; name: string; code: string } | null;
}

export interface FacultyImportResult {
  created: number;
  failed: number;
  errors: Array<{ row: number; message: string }>;
}

export interface Subject {
  id: string;
  subjectCode: string;
  subjectName: string;
  shortName: string | null;
  credits: number;
  theoryHours: number;
  practicalHours: number;
  totalHours: number;
  departmentId: string;
  courseId: string;
  semesterId: string;
  facultyId: string | null;
  collegeId: string;
  description: string | null;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  department?: { id: string; name: string; code: string };
  course?: { id: string; name: string; code: string };
  semester?: { id: string; name: string; semesterNumber: number };
  faculty?: {
    id: string;
    firstName: string;
    lastName: string;
    facultyId: string;
    employeeId: string;
  } | null;
  college?: { id: string; name: string; code: string };
}

export interface SubjectListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AcademicStatus;
  departmentId?: string;
  courseId?: string;
  semesterId?: string;
  facultyId?: string;
  collegeId?: string;
  assignment?: 'all' | 'assigned' | 'unassigned';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SubjectPayload {
  subjectName: string;
  shortName?: string | null;
  credits: number;
  theoryHours?: number;
  practicalHours?: number;
  departmentId: string;
  courseId: string;
  semesterId: string;
  facultyId?: string | null;
  description?: string | null;
  status?: AcademicStatus;
  collegeId?: string;
  subjectCode?: string;
}

export interface SubjectDashboardStats {
  totalSubjects: number;
  assignedSubjects: number;
  unassignedSubjects: number;
  activeSubjects: number;
  subjectsByDepartment: Array<{
    departmentId: string;
    departmentName: string;
    count: number;
  }>;
  subjectsBySemester: Array<{
    semesterId: string;
    semesterName: string;
    count: number;
  }>;
  college: { id: string; name: string; code: string } | null;
}

