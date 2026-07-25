import { z } from 'zod';
import { ExamStatus, ExamType, ResultStatus } from '@prisma/client';

export const createExamSchema = z.object({
  collegeId: z.string().optional(),
  departmentId: z.string({ required_error: 'Department ID is required' }),
  courseId: z.string({ required_error: 'Course ID is required' }),
  semesterId: z.string({ required_error: 'Semester ID is required' }),
  examName: z.string({ required_error: 'Exam name is required' }),
  examType: z.nativeEnum(ExamType).optional().default(ExamType.SEMESTER_END),
  academicYear: z.string().optional().default('2025-2026'),
  startDate: z.string({ required_error: 'Start date is required' }),
  endDate: z.string({ required_error: 'End date is required' }),
  status: z.nativeEnum(ExamStatus).optional().default(ExamStatus.SCHEDULED),
});

export const updateExamSchema = z.object({
  examName: z.string().optional(),
  examType: z.nativeEnum(ExamType).optional(),
  academicYear: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.nativeEnum(ExamStatus).optional(),
});

export const createExamSubjectSchema = z.object({
  examId: z.string({ required_error: 'Exam ID is required' }),
  subjectId: z.string({ required_error: 'Subject ID is required' }),
  facultyId: z.string().optional(),
  maxMarks: z.number().positive({ message: 'Max marks must be positive' }).optional().default(100),
  passingMarks: z.number().positive({ message: 'Passing marks must be positive' }).optional().default(40),
  examDate: z.string({ required_error: 'Exam date is required' }),
  startTime: z.string({ required_error: 'Start time is required' }),
  endTime: z.string({ required_error: 'End time is required' }),
});

export const bulkMarksEntrySchema = z.object({
  examId: z.string({ required_error: 'Exam ID is required' }),
  subjectId: z.string({ required_error: 'Subject ID is required' }),
  marks: z.array(
    z.object({
      studentId: z.string({ required_error: 'Student ID is required' }),
      obtainedMarks: z.number().min(0, { message: 'Obtained marks cannot be negative' }),
      resultStatus: z.nativeEnum(ResultStatus).optional().default(ResultStatus.PASS),
      remarks: z.string().optional(),
    })
  ),
});

export const examQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  departmentId: z.string().optional(),
  courseId: z.string().optional(),
  semesterId: z.string().optional(),
  examType: z.nativeEnum(ExamType).optional(),
  status: z.nativeEnum(ExamStatus).optional(),
  isPublished: z.string().optional().transform((val) => val === 'true'),
});

export const idParamSchema = z.object({
  id: z.string({ required_error: 'ID parameter is required' }),
});
