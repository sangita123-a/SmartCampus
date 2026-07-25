import { z } from 'zod';

export const subscriptionPlanEnum = z.enum(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE']);
export const collegeStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);

const optionalUrl = z
  .union([z.string().url('Invalid URL'), z.literal(''), z.null()])
  .optional()
  .transform((value) => (value === '' || value === undefined ? null : value));

const collegeBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'College name must be at least 2 characters')
    .max(150, 'College name must be at most 150 characters'),
  code: z
    .string()
    .trim()
    .min(2, 'College code must be at least 2 characters')
    .max(32, 'College code must be at most 32 characters')
    .regex(/^[A-Za-z0-9_-]+$/, 'Code may only contain letters, numbers, _ and -')
    .transform((value) => value.toUpperCase()),
  email: z.string().trim().email('Invalid college email').toLowerCase(),
  phone: z
    .union([z.string().trim().min(7).max(20), z.literal(''), z.null()])
    .optional()
    .transform((value) => (value === '' || value === undefined ? null : value)),
  address: z
    .union([z.string().trim().max(500), z.literal(''), z.null()])
    .optional()
    .transform((value) => (value === '' || value === undefined ? null : value)),
  website: optionalUrl,
  logo: optionalUrl,
  status: collegeStatusEnum.optional(),
  subscriptionPlan: subscriptionPlanEnum.optional(),
  subscriptionStart: z.coerce.date().optional(),
  subscriptionEnd: z.coerce.date().optional().nullable(),
});

export const createCollegeSchema = collegeBaseSchema;

export const updateCollegeSchema = collegeBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required' }
);

export const collegeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: collegeStatusEnum.optional(),
  subscriptionPlan: subscriptionPlanEnum.optional(),
  sortBy: z
    .enum(['name', 'code', 'email', 'status', 'subscriptionPlan', 'createdAt', 'subscriptionEnd'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateCollegeInput = z.infer<typeof createCollegeSchema>;
export type UpdateCollegeInput = z.infer<typeof updateCollegeSchema>;
export type CollegeQueryInput = z.infer<typeof collegeQuerySchema>;
