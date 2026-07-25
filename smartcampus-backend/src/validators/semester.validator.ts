import { z } from 'zod';

import { academicStatusEnum } from './department.validator';



export const semesterBaseSchema = z

  .object({

    courseId: z.string().cuid('Invalid course id'),

    semesterNumber: z.coerce

      .number()

      .int('Semester number must be a whole number')

      .min(1, 'Semester number must be at least 1')

      .max(20, 'Semester number must be at most 20'),

    name: z

      .string()

      .trim()

      .min(2, 'Semester name must be at least 2 characters')

      .max(100, 'Semester name must be at most 100 characters'),

    startDate: z.coerce.date({ required_error: 'Start date is required' }),

    endDate: z.coerce.date({ required_error: 'End date is required' }),

    status: academicStatusEnum.optional(),

  })

  .refine((data) => data.endDate > data.startDate, {

    message: 'End date must be after start date',

    path: ['endDate'],

  });



export const createSemesterSchema = semesterBaseSchema;



export const updateSemesterSchema = z

  .object({

    courseId: z.string().cuid('Invalid course id').optional(),

    semesterNumber: z.coerce

      .number()

      .int('Semester number must be a whole number')

      .min(1, 'Semester number must be at least 1')

      .max(20, 'Semester number must be at most 20')

      .optional(),

    name: z

      .string()

      .trim()

      .min(2, 'Semester name must be at least 2 characters')

      .max(100, 'Semester name must be at most 100 characters')

      .optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

    status: academicStatusEnum.optional(),

  })

  .refine((data) => Object.keys(data).length > 0, {

    message: 'At least one field is required',

  })

  .refine(

    (data) => {

      if (data.startDate && data.endDate) {

        return data.endDate > data.startDate;

      }

      return true;

    },

    {

      message: 'End date must be after start date',

      path: ['endDate'],

    }

  );



export const semesterQuerySchema = z.object({

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  status: academicStatusEnum.optional(),

  courseId: z.string().cuid().optional(),

  collegeId: z.string().cuid().optional(),

  sortBy: z

    .enum(['semesterNumber', 'name', 'startDate', 'endDate', 'status', 'createdAt', 'updatedAt'])

    .default('semesterNumber'),

  sortOrder: z.enum(['asc', 'desc']).default('asc'),

});



export const semesterIdParamSchema = z.object({

  id: z.string().cuid('Invalid semester id'),

});



export type CreateSemesterInput = z.infer<typeof createSemesterSchema>;

export type UpdateSemesterInput = z.infer<typeof updateSemesterSchema>;

export type SemesterQueryInput = z.infer<typeof semesterQuerySchema>;

