import { z } from 'zod';



export const academicStatusEnum = z.enum(['ACTIVE', 'INACTIVE']);



export const departmentBaseSchema = z.object({

  name: z

    .string()

    .trim()

    .min(2, 'Department name must be at least 2 characters')

    .max(150, 'Department name must be at most 150 characters'),

  code: z

    .string()

    .trim()

    .min(2, 'Department code must be at least 2 characters')

    .max(32, 'Department code must be at most 32 characters')

    .regex(/^[A-Za-z0-9_-]+$/, 'Code may only contain letters, numbers, _ and -')

    .transform((value) => value.toUpperCase()),

  description: z

    .union([z.string().trim().max(1000), z.literal(''), z.null()])

    .optional()

    .transform((value) => (value === '' || value === undefined ? null : value)),

  status: academicStatusEnum.optional(),

  collegeId: z.string().cuid('Invalid college id').optional(),

});



export const createDepartmentSchema = departmentBaseSchema;



export const updateDepartmentSchema = departmentBaseSchema

  .omit({ collegeId: true })

  .partial()

  .refine((data) => Object.keys(data).length > 0, {

    message: 'At least one field is required',

  });



export const departmentQuerySchema = z.object({

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  status: academicStatusEnum.optional(),

  collegeId: z.string().cuid().optional(),

  sortBy: z.enum(['name', 'code', 'status', 'createdAt', 'updatedAt']).default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).default('desc'),

});



export const departmentIdParamSchema = z.object({

  id: z.string().cuid('Invalid department id'),

});



export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;

export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;

export type DepartmentQueryInput = z.infer<typeof departmentQuerySchema>;

