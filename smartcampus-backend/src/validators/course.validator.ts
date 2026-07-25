import { z } from 'zod';

import { academicStatusEnum } from './department.validator';



export const courseTypeEnum = z.enum([

  'UNDERGRADUATE',

  'POSTGRADUATE',

  'DIPLOMA',

  'CERTIFICATE',

  'OTHER',

]);



export const courseBaseSchema = z.object({

  departmentId: z.string().cuid('Invalid department id'),

  name: z

    .string()

    .trim()

    .min(2, 'Course name must be at least 2 characters')

    .max(150, 'Course name must be at most 150 characters'),

  code: z

    .string()

    .trim()

    .min(2, 'Course code must be at least 2 characters')

    .max(32, 'Course code must be at most 32 characters')

    .regex(/^[A-Za-z0-9_-]+$/, 'Code may only contain letters, numbers, _ and -')

    .transform((value) => value.toUpperCase()),

  duration: z.coerce

    .number()

    .int('Duration must be a whole number')

    .min(1, 'Duration must be at least 1 semester/year unit')

    .max(20, 'Duration must be at most 20'),

  courseType: courseTypeEnum.optional(),

  description: z

    .union([z.string().trim().max(1000), z.literal(''), z.null()])

    .optional()

    .transform((value) => (value === '' || value === undefined ? null : value)),

  status: academicStatusEnum.optional(),

  collegeId: z.string().cuid('Invalid college id').optional(),

});



export const createCourseSchema = courseBaseSchema;



export const updateCourseSchema = courseBaseSchema

  .omit({ collegeId: true })

  .partial()

  .refine((data) => Object.keys(data).length > 0, {

    message: 'At least one field is required',

  });



export const courseQuerySchema = z.object({

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  status: academicStatusEnum.optional(),

  courseType: courseTypeEnum.optional(),

  departmentId: z.string().cuid().optional(),

  collegeId: z.string().cuid().optional(),

  sortBy: z

    .enum(['name', 'code', 'duration', 'courseType', 'status', 'createdAt', 'updatedAt'])

    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).default('desc'),

});



export const courseIdParamSchema = z.object({

  id: z.string().cuid('Invalid course id'),

});



export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

export type CourseQueryInput = z.infer<typeof courseQuerySchema>;

