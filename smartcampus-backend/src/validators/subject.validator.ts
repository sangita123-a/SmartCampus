import { z } from 'zod';

export const academicStatusEnum = z.enum(['ACTIVE', 'INACTIVE']);

const optionalString = (max: number) =>
  z
    .union([z.string().trim().max(max), z.literal(''), z.null()])
    .optional()
    .transform((value) => (value === '' || value === undefined ? null : value));

export const createSubjectSchema = z
  .object({
    subjectName: z.string().trim().min(2, 'Subject name is required').max(150),
    shortName: optionalString(50),
    credits: z.coerce.number().int().min(1, 'Credits must be at least 1').max(30),
    theoryHours: z.coerce.number().int().min(0).max(200).optional().default(0),
    practicalHours: z.coerce.number().int().min(0).max(200).optional().default(0),
    departmentId: z.string().cuid('Invalid department id'),
    courseId: z.string().cuid('Invalid course id'),
    semesterId: z.string().cuid('Invalid semester id'),
    facultyId: z.string().cuid('Invalid faculty id').optional().nullable(),
    description: optionalString(1000),
    status: academicStatusEnum.optional(),
    collegeId: z.string().cuid().optional(),
    subjectCode: z.string().trim().min(3).max(32).optional(),
  })
  .refine(
    (data) => (data.theoryHours ?? 0) + (data.practicalHours ?? 0) > 0 || data.credits > 0,
    { message: 'Provide credits and/or teaching hours', path: ['credits'] }
  );

export const updateSubjectSchema = z
  .object({
    subjectName: z.string().trim().min(2).max(150).optional(),
    shortName: optionalString(50),
    credits: z.coerce.number().int().min(1).max(30).optional(),
    theoryHours: z.coerce.number().int().min(0).max(200).optional(),
    practicalHours: z.coerce.number().int().min(0).max(200).optional(),
    departmentId: z.string().cuid().optional(),
    courseId: z.string().cuid().optional(),
    semesterId: z.string().cuid().optional(),
    facultyId: z.string().cuid().optional().nullable(),
    description: optionalString(1000),
    status: academicStatusEnum.optional(),
    subjectCode: z.string().trim().min(3).max(32).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export const subjectQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: academicStatusEnum.optional(),
  departmentId: z.string().cuid().optional(),
  courseId: z.string().cuid().optional(),
  semesterId: z.string().cuid().optional(),
  facultyId: z.string().cuid().optional(),
  collegeId: z.string().cuid().optional(),
  assignment: z.enum(['all', 'assigned', 'unassigned']).optional().default('all'),
  sortBy: z
    .enum([
      'subjectCode',
      'subjectName',
      'credits',
      'totalHours',
      'status',
      'createdAt',
    ])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const subjectIdParamSchema = z.object({
  id: z.string().cuid('Invalid subject id'),
});

export const assignFacultySchema = z.object({
  facultyId: z.string().cuid('Invalid faculty id'),
});

export const bulkSubjectIdsSchema = z.object({
  ids: z.array(z.string().cuid()).min(1, 'At least one subject id is required'),
});

export const bulkSubjectStatusSchema = z.object({
  ids: z.array(z.string().cuid()).min(1, 'At least one subject id is required'),
  status: academicStatusEnum,
});

export const subjectExportSchema = z.object({
  format: z.enum(['csv', 'xlsx']).default('csv'),
  search: z.string().trim().optional(),
  status: academicStatusEnum.optional(),
  departmentId: z.string().cuid().optional(),
  courseId: z.string().cuid().optional(),
  semesterId: z.string().cuid().optional(),
  facultyId: z.string().cuid().optional(),
  collegeId: z.string().cuid().optional(),
  assignment: z.enum(['all', 'assigned', 'unassigned']).optional().default('all'),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
export type SubjectQueryInput = z.infer<typeof subjectQuerySchema>;
export type AssignFacultyInput = z.infer<typeof assignFacultySchema>;
export type BulkSubjectIdsInput = z.infer<typeof bulkSubjectIdsSchema>;
export type BulkSubjectStatusInput = z.infer<typeof bulkSubjectStatusSchema>;
export type SubjectExportInput = z.infer<typeof subjectExportSchema>;
