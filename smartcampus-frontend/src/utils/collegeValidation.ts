import { z } from 'zod';

export const collegeFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .regex(/^[A-Za-z0-9_-]+$/, 'Only letters, numbers, _ and -'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine((value) => !value || /^https?:\/\//.test(value), 'Enter a valid URL'),
  logo: z
    .string()
    .optional()
    .refine((value) => !value || /^https?:\/\//.test(value), 'Enter a valid URL'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  subscriptionPlan: z.enum(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE']),
  subscriptionEnd: z.string().optional(),
});

export type CollegeFormValues = z.infer<typeof collegeFormSchema>;
