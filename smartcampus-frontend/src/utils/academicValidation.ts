import { z } from 'zod';



export const academicStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);



export const departmentFormSchema = z.object({

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

    .regex(/^[A-Za-z0-9_-]+$/, 'Code may only contain letters, numbers, _ and -'),

  description: z.string().trim().max(1000).optional().or(z.literal('')),

  status: academicStatusSchema,

});



export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;



export const courseFormSchema = z.object({

  departmentId: z.string().min(1, 'Department is required'),

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

    .regex(/^[A-Za-z0-9_-]+$/, 'Code may only contain letters, numbers, _ and -'),

  duration: z

    .number({ error: 'Duration is required' })

    .int('Duration must be a whole number')

    .min(1, 'Duration must be at least 1')

    .max(20, 'Duration must be at most 20'),

  courseType: z.enum([

    'UNDERGRADUATE',

    'POSTGRADUATE',

    'DIPLOMA',

    'CERTIFICATE',

    'OTHER',

  ]),

  description: z.string().trim().max(1000).optional().or(z.literal('')),

  status: academicStatusSchema,

});



export type CourseFormValues = z.infer<typeof courseFormSchema>;



export const semesterFormSchema = z

  .object({

    courseId: z.string().min(1, 'Course is required'),

    semesterNumber: z

      .number({ error: 'Semester number is required' })

      .int('Semester number must be a whole number')

      .min(1, 'Semester number must be at least 1')

      .max(20, 'Semester number must be at most 20'),

    name: z

      .string()

      .trim()

      .min(2, 'Semester name must be at least 2 characters')

      .max(100, 'Semester name must be at most 100 characters'),

    startDate: z.string().min(1, 'Start date is required'),

    endDate: z.string().min(1, 'End date is required'),

    status: academicStatusSchema,

  })

  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {

    message: 'End date must be after start date',

    path: ['endDate'],

  });



export type SemesterFormValues = z.infer<typeof semesterFormSchema>;

