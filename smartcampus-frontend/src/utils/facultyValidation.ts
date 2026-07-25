import { z } from 'zod';

export const facultyFormSchema = z.object({
  departmentId: z.string().min(1, 'Department is required'),
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  email: z.string().trim().email('Invalid email'),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone must be at least 7 digits')
    .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  dateOfBirth: z.string().optional(),
  qualification: z.string().optional(),
  experience: z
    .number({ invalid_type_error: 'Experience is required', required_error: 'Experience is required' })
    .int('Experience must be a whole number')
    .min(0)
    .max(60),
  designation: z.string().trim().min(2, 'Designation is required').max(120),
  joiningDate: z.string().optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'VISITING']),
  salary: z.string().optional(),
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
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  profileImage: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED']),
  employeeId: z.string().optional(),
});

export type FacultyFormValues = z.infer<typeof facultyFormSchema>;
