import { z } from 'zod';
import { AttendanceMethod, AttendanceStatus } from '@prisma/client';

export const attendanceQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  departmentId: z.string().optional(),
  courseId: z.string().optional(),
  semesterId: z.string().optional(),
  subjectId: z.string().optional(),
  facultyId: z.string().optional(),
  studentId: z.string().optional(),
  attendanceDate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  attendanceStatus: z.nativeEnum(AttendanceStatus).optional(),
  attendanceMethod: z.nativeEnum(AttendanceMethod).optional(),
  sortBy: z.string().optional().default('attendanceDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const createAttendanceSchema = z.object({
  collegeId: z.string().optional(),
  departmentId: z.string({ required_error: 'Department ID is required' }),
  courseId: z.string({ required_error: 'Course ID is required' }),
  semesterId: z.string({ required_error: 'Semester ID is required' }),
  subjectId: z.string({ required_error: 'Subject ID is required' }),
  facultyId: z.string({ required_error: 'Faculty ID is required' }),
  studentId: z.string({ required_error: 'Student ID is required' }),
  attendanceDate: z.string({ required_error: 'Attendance date is required' }),
  attendanceStatus: z.nativeEnum(AttendanceStatus, {
    required_error: 'Attendance status is required',
  }),
  attendanceMethod: z.nativeEnum(AttendanceMethod).optional().default(AttendanceMethod.MANUAL),
  remarks: z.string().optional(),
});

export const bulkAttendanceItemSchema = z.object({
  studentId: z.string({ required_error: 'Student ID is required' }),
  attendanceStatus: z.nativeEnum(AttendanceStatus),
  remarks: z.string().optional(),
});

export const bulkMarkAttendanceSchema = z.object({
  collegeId: z.string().optional(),
  departmentId: z.string({ required_error: 'Department ID is required' }),
  courseId: z.string({ required_error: 'Course ID is required' }),
  semesterId: z.string({ required_error: 'Semester ID is required' }),
  subjectId: z.string({ required_error: 'Subject ID is required' }),
  facultyId: z.string({ required_error: 'Faculty ID is required' }),
  attendanceDate: z.string({ required_error: 'Attendance date is required' }),
  attendanceMethod: z.nativeEnum(AttendanceMethod).optional().default(AttendanceMethod.MANUAL),
  records: z.array(bulkAttendanceItemSchema).min(1, 'At least one student record is required'),
});

export const updateAttendanceSchema = z.object({
  attendanceStatus: z.nativeEnum(AttendanceStatus).optional(),
  attendanceMethod: z.nativeEnum(AttendanceMethod).optional(),
  remarks: z.string().optional(),
});

export const createQRSessionSchema = z.object({
  collegeId: z.string().optional(),
  departmentId: z.string({ required_error: 'Department ID is required' }),
  courseId: z.string({ required_error: 'Course ID is required' }),
  semesterId: z.string({ required_error: 'Semester ID is required' }),
  subjectId: z.string({ required_error: 'Subject ID is required' }),
  facultyId: z.string({ required_error: 'Faculty ID is required' }),
  durationMinutes: z.number().optional().default(15),
});

export const scanQRAttendanceSchema = z.object({
  sessionCode: z.string({ required_error: 'Session code is required' }),
  studentId: z.string({ required_error: 'Student ID is required' }),
});

export const attendanceIdParamSchema = z.object({
  id: z.string({ required_error: 'Attendance ID is required' }),
});
