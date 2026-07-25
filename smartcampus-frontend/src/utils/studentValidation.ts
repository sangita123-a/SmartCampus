import { z } from 'zod';

export const studentFormSchema = z.object({
  departmentId: z.string().min(1, 'Department is required'),
  courseId: z.string().min(1, 'Course is required'),
  semesterId: z.string().min(1, 'Semester is required'),
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  email: z.string().trim().email('Invalid email'),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone must be at least 7 digits')
    .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  bloodGroup: z.enum([
    'A_POS',
    'A_NEG',
    'B_POS',
    'B_NEG',
    'AB_POS',
    'AB_NEG',
    'O_POS',
    'O_NEG',
    'UNKNOWN',
  ]),
  admissionDate: z.string().optional(),
  rollNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  profileImage: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'SUSPENDED']),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z
    .string()
    .optional()
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Invalid guardian email'),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
