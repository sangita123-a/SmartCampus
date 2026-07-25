import { z } from 'zod';

export const subjectFormSchema = z.object({
  subjectName: z.string().trim().min(2, 'Subject name is required').max(150),
  shortName: z.string().optional(),
  credits: z
    .number({ invalid_type_error: 'Credits are required', required_error: 'Credits are required' })
    .int()
    .min(1, 'Credits must be at least 1')
    .max(30),
  theoryHours: z.number().int().min(0).max(200),
  practicalHours: z.number().int().min(0).max(200),
  departmentId: z.string().min(1, 'Department is required'),
  courseId: z.string().min(1, 'Course is required'),
  semesterId: z.string().min(1, 'Semester is required'),
  facultyId: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  subjectCode: z.string().optional(),
});

export type SubjectFormValues = z.infer<typeof subjectFormSchema>;
