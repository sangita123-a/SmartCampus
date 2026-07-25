import { z } from 'zod';
import { DayOfWeek, TimetableStatus } from '@prisma/client';

export const timetableQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 50)),
  search: z.string().optional(),
  departmentId: z.string().optional(),
  courseId: z.string().optional(),
  semesterId: z.string().optional(),
  subjectId: z.string().optional(),
  facultyId: z.string().optional(),
  classroomId: z.string().optional(),
  dayOfWeek: z.nativeEnum(DayOfWeek).optional(),
  academicYear: z.string().optional(),
  status: z.nativeEnum(TimetableStatus).optional(),
  sortBy: z.string().optional().default('startTime'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createTimetableSchema = z
  .object({
    collegeId: z.string().optional(),
    departmentId: z.string({ required_error: 'Department ID is required' }),
    courseId: z.string({ required_error: 'Course ID is required' }),
    semesterId: z.string({ required_error: 'Semester ID is required' }),
    subjectId: z.string({ required_error: 'Subject ID is required' }),
    facultyId: z.string({ required_error: 'Faculty ID is required' }),
    classroomId: z.string({ required_error: 'Classroom ID is required' }),
    dayOfWeek: z.nativeEnum(DayOfWeek, { required_error: 'Day of week is required' }),
    startTime: z.string().regex(timeRegex, 'Start time must be in HH:mm 24hr format (e.g. 09:00)'),
    endTime: z.string().regex(timeRegex, 'End time must be in HH:mm 24hr format (e.g. 10:00)'),
    academicYear: z.string().optional().default('2025-2026'),
    status: z.nativeEnum(TimetableStatus).optional().default(TimetableStatus.ACTIVE),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'End time must be strictly after Start time',
    path: ['endTime'],
  });

export const updateTimetableSchema = z.object({
  departmentId: z.string().optional(),
  courseId: z.string().optional(),
  semesterId: z.string().optional(),
  subjectId: z.string().optional(),
  facultyId: z.string().optional(),
  classroomId: z.string().optional(),
  dayOfWeek: z.nativeEnum(DayOfWeek).optional(),
  startTime: z.string().regex(timeRegex).optional(),
  endTime: z.string().regex(timeRegex).optional(),
  academicYear: z.string().optional(),
  status: z.nativeEnum(TimetableStatus).optional(),
});

export const timetableIdParamSchema = z.object({
  id: z.string({ required_error: 'Timetable ID is required' }),
});
