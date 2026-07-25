import { z } from 'zod';

export const genderEnum = z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']);
export const facultyStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED']);
export const employmentTypeEnum = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'VISITING']);
export const bloodGroupEnum = z.enum([
  'A_POS',
  'A_NEG',
  'B_POS',
  'B_NEG',
  'AB_POS',
  'AB_NEG',
  'O_POS',
  'O_NEG',
  'UNKNOWN',
]);

const phoneSchema = z
  .string()
  .trim()
  .min(7, 'Phone must be at least 7 digits')
  .max(20, 'Phone must be at most 20 characters')
  .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number');

const optionalString = (max: number) =>
  z
    .union([z.string().trim().max(max), z.literal(''), z.null()])
    .optional()
    .transform((value) => (value === '' || value === undefined ? null : value));

export const createFacultySchema = z.object({
  departmentId: z.string().cuid('Invalid department id'),
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  email: z.string().trim().email('Invalid email').toLowerCase(),
  phone: phoneSchema,
  gender: genderEnum,
  dateOfBirth: z.coerce.date().optional().nullable(),
  qualification: optionalString(200),
  experience: z.coerce.number().int().min(0).max(60).optional().default(0),
  designation: z.string().trim().min(2, 'Designation is required').max(120),
  joiningDate: z.coerce.date().optional(),
  employmentType: employmentTypeEnum.optional(),
  salary: z.coerce.number().min(0).max(100000000).optional().nullable(),
  bloodGroup: bloodGroupEnum.optional(),
  address: optionalString(500),
  city: optionalString(100),
  state: optionalString(100),
  country: optionalString(100),
  pincode: optionalString(20),
  profileImage: z
    .union([z.string().trim().url('Invalid profile image URL'), z.literal(''), z.null()])
    .optional()
    .transform((value) => (value === '' || value === undefined ? undefined : value)),
  status: facultyStatusEnum.optional(),
  employeeId: z.string().trim().min(2).max(50).optional(),
  collegeId: z.string().cuid().optional(),
  userId: z.string().cuid().optional().nullable(),
});

export const updateFacultySchema = createFacultySchema
  .omit({ collegeId: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export const facultyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: facultyStatusEnum.optional(),
  designation: z.string().trim().optional(),
  employmentType: employmentTypeEnum.optional(),
  departmentId: z.string().cuid().optional(),
  collegeId: z.string().cuid().optional(),
  recentlyJoined: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .optional()
    .transform((value) => value === true || value === 'true'),
  sortBy: z
    .enum([
      'firstName',
      'lastName',
      'facultyId',
      'employeeId',
      'designation',
      'experience',
      'joiningDate',
      'status',
      'createdAt',
    ])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const facultyIdParamSchema = z.object({
  id: z.string().cuid('Invalid faculty id'),
});

export const bulkFacultyIdsSchema = z.object({
  ids: z.array(z.string().cuid()).min(1, 'At least one faculty id is required'),
});

export const bulkFacultyStatusSchema = z.object({
  ids: z.array(z.string().cuid()).min(1, 'At least one faculty id is required'),
  status: facultyStatusEnum,
});

export const facultyExportSchema = z.object({
  format: z.enum(['csv', 'xlsx']).default('csv'),
  search: z.string().trim().optional(),
  status: facultyStatusEnum.optional(),
  designation: z.string().trim().optional(),
  departmentId: z.string().cuid().optional(),
  collegeId: z.string().cuid().optional(),
  recentlyJoined: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .optional()
    .transform((value) => value === true || value === 'true'),
});

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;
export type FacultyQueryInput = z.infer<typeof facultyQuerySchema>;
export type BulkFacultyIdsInput = z.infer<typeof bulkFacultyIdsSchema>;
export type BulkFacultyStatusInput = z.infer<typeof bulkFacultyStatusSchema>;
export type FacultyExportInput = z.infer<typeof facultyExportSchema>;
