import { z } from 'zod';

export const linkParentStudentSchema = z.object({
  parentId: z.string({ required_error: 'Parent User ID is required' }),
  studentId: z.string({ required_error: 'Student ID is required' }),
  relationship: z.string().optional().default('GUARDIAN'),
  isPrimaryGuardian: z.boolean().optional().default(true),
});

export const updateParentProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const studentParamSchema = z.object({
  studentId: z.string({ required_error: 'studentId parameter is required' }),
});
