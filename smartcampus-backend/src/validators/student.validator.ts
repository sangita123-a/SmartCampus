import { z } from 'zod';



export const genderEnum = z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']);

export const studentStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'SUSPENDED']);

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



const optionalPhone = z

  .union([phoneSchema, z.literal(''), z.null()])

  .optional()

  .transform((value) => (value === '' || value === undefined ? null : value));



const optionalString = (max: number) =>

  z

    .union([z.string().trim().max(max), z.literal(''), z.null()])

    .optional()

    .transform((value) => (value === '' || value === undefined ? null : value));



export const createStudentSchema = z.object({

  departmentId: z.string().cuid('Invalid department id'),

  courseId: z.string().cuid('Invalid course id'),

  semesterId: z.string().cuid('Invalid semester id'),

  firstName: z.string().trim().min(1, 'First name is required').max(80),

  lastName: z.string().trim().min(1, 'Last name is required').max(80),

  gender: genderEnum,

  dateOfBirth: z.coerce.date({ required_error: 'Date of birth is required' }),

  email: z.string().trim().email('Invalid email').toLowerCase(),

  phone: phoneSchema,

  address: optionalString(500),

  city: optionalString(100),

  state: optionalString(100),

  country: optionalString(100),

  pincode: optionalString(20),

  bloodGroup: bloodGroupEnum.optional(),

  admissionDate: z.coerce.date().optional(),

  rollNumber: z.string().trim().min(2).max(50).optional(),

  registrationNumber: z.string().trim().min(2).max(50).optional(),

  profileImage: z
    .union([z.string().trim().url('Invalid profile image URL'), z.literal(''), z.null()])
    .optional()
    .transform((value) => (value === '' || value === undefined ? undefined : value)),

  status: studentStatusEnum.optional(),

  guardianName: optionalString(150),

  guardianPhone: optionalPhone,

  guardianEmail: z

    .union([z.string().trim().email('Invalid guardian email').toLowerCase(), z.literal(''), z.null()])

    .optional()

    .transform((value) => (value === '' || value === undefined ? null : value)),

  collegeId: z.string().cuid().optional(),

  userId: z.string().cuid().optional().nullable(),

});



export const updateStudentSchema = createStudentSchema

  .omit({ collegeId: true })

  .partial()

  .refine((data) => Object.keys(data).length > 0, {

    message: 'At least one field is required',

  });



export const studentQuerySchema = z.object({

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  status: studentStatusEnum.optional(),

  gender: genderEnum.optional(),

  departmentId: z.string().cuid().optional(),

  courseId: z.string().cuid().optional(),

  semesterId: z.string().cuid().optional(),

  collegeId: z.string().cuid().optional(),

  admissionFrom: z.coerce.date().optional(),

  admissionTo: z.coerce.date().optional(),

  sortBy: z

    .enum([

      'firstName',

      'lastName',

      'studentId',

      'rollNumber',

      'email',

      'status',

      'admissionDate',

      'createdAt',

    ])

    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).default('desc'),

});



export const studentIdParamSchema = z.object({

  id: z.string().cuid('Invalid student id'),

});



export const bulkIdsSchema = z.object({

  ids: z.array(z.string().cuid()).min(1, 'At least one student id is required'),

});



export const bulkStatusSchema = z.object({

  ids: z.array(z.string().cuid()).min(1, 'At least one student id is required'),

  status: studentStatusEnum,

});



export const exportFormatSchema = z.object({

  format: z.enum(['csv', 'xlsx']).default('csv'),

  search: z.string().trim().optional(),

  status: studentStatusEnum.optional(),

  departmentId: z.string().cuid().optional(),

  courseId: z.string().cuid().optional(),

  semesterId: z.string().cuid().optional(),

  collegeId: z.string().cuid().optional(),

});



export type CreateStudentInput = z.infer<typeof createStudentSchema>;

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;

export type StudentQueryInput = z.infer<typeof studentQuerySchema>;

export type BulkIdsInput = z.infer<typeof bulkIdsSchema>;

export type BulkStatusInput = z.infer<typeof bulkStatusSchema>;

export type ExportFormatInput = z.infer<typeof exportFormatSchema>;

