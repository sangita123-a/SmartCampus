import {

  BloodGroup,

  Gender,

  Prisma,

  Student,

  StudentStatus,

} from '@prisma/client';

import * as XLSX from 'xlsx';

import { prisma } from '../config/database';

import { AppError } from '../utils/AppError';

import { AuthUserPayload } from '../types/express';

import { Role as AppRole } from '../types/roles';

import {

  BulkIdsInput,

  BulkStatusInput,

  CreateStudentInput,

  ExportFormatInput,

  StudentQueryInput,

  UpdateStudentInput,

} from '../validators/student.validator';



export type StudentRelations = {

  department: { id: string; name: string; code: string };

  course: { id: string; name: string; code: string };

  semester: { id: string; name: string; semesterNumber: number };

  college?: { id: string; name: string; code: string };

};



export type StudentWithRelations = Student & StudentRelations;



export interface PaginatedStudents {

  items: StudentWithRelations[];

  meta: {

    page: number;

    limit: number;

    total: number;

    totalPages: number;

  };

}



export interface StudentDashboardStats {

  totalStudents: number;

  activeStudents: number;

  inactiveStudents: number;

  newAdmissions: number;

  college: { id: string; name: string; code: string } | null;

}



export interface ImportResult {

  created: number;

  failed: number;

  errors: Array<{ row: number; message: string }>;

}



const studentInclude = {

  department: { select: { id: true, name: true, code: true } },

  course: { select: { id: true, name: true, code: true } },

  semester: { select: { id: true, name: true, semesterNumber: true } },

  college: { select: { id: true, name: true, code: true } },

} satisfies Prisma.StudentInclude;



export class StudentService {

  public async getDashboardStats(actor: AuthUserPayload): Promise<StudentDashboardStats> {

    const collegeId = this.requireCollegeScope(actor);

    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);



    const [totalStudents, activeStudents, inactiveStudents, newAdmissions, college] =

      await Promise.all([

        prisma.student.count({ where: { collegeId } }),

        prisma.student.count({ where: { collegeId, status: StudentStatus.ACTIVE } }),

        prisma.student.count({

          where: {

            collegeId,

            status: { in: [StudentStatus.INACTIVE, StudentStatus.SUSPENDED] },

          },

        }),

        prisma.student.count({

          where: { collegeId, admissionDate: { gte: thirtyDaysAgo } },

        }),

        prisma.college.findUnique({

          where: { id: collegeId },

          select: { id: true, name: true, code: true },

        }),

      ]);



    return {

      totalStudents,

      activeStudents,

      inactiveStudents,

      newAdmissions,

      college,

    };

  }



  public async create(

    payload: CreateStudentInput,

    actor: AuthUserPayload

  ): Promise<StudentWithRelations> {

    this.assertCanMutate(actor);

    const collegeId = this.resolveWriteCollegeId(actor, payload.collegeId);

    const academic = await this.assertAcademicHierarchy(

      collegeId,

      payload.departmentId,

      payload.courseId,

      payload.semesterId

    );



    const college = await prisma.college.findUniqueOrThrow({ where: { id: collegeId } });

    const studentId = await this.generateStudentId(college.code);

    const rollNumber =

      payload.rollNumber?.trim() ||

      (await this.generateRollNumber(collegeId, academic.department.code, academic.course.code));

    const registrationNumber =

      payload.registrationNumber?.trim() ||

      (await this.generateRegistrationNumber(collegeId, college.code));



    await this.assertUniqueFields(collegeId, {

      email: payload.email,

      rollNumber,

      registrationNumber,

    });



    try {

      return await prisma.student.create({

        data: {

          studentId,

          collegeId,

          departmentId: payload.departmentId,

          courseId: payload.courseId,

          semesterId: payload.semesterId,

          userId: payload.userId ?? null,

          firstName: payload.firstName,

          lastName: payload.lastName,

          gender: payload.gender as Gender,

          dateOfBirth: payload.dateOfBirth,

          email: payload.email,

          phone: payload.phone,

          address: payload.address ?? null,

          city: payload.city ?? null,

          state: payload.state ?? null,

          country: payload.country ?? null,

          pincode: payload.pincode ?? null,

          bloodGroup: (payload.bloodGroup as BloodGroup | undefined) ?? BloodGroup.UNKNOWN,

          admissionDate: payload.admissionDate ?? new Date(),

          rollNumber,

          registrationNumber,

          profileImage: payload.profileImage ?? null,

          status: (payload.status as StudentStatus | undefined) ?? StudentStatus.ACTIVE,

          guardianName: payload.guardianName ?? null,

          guardianPhone: payload.guardianPhone ?? null,

          guardianEmail: payload.guardianEmail ?? null,

        },

        include: studentInclude,

      });

    } catch (error) {

      this.handleUniqueConstraint(error);

      throw error;

    }

  }



  public async list(

    query: StudentQueryInput,

    actor: AuthUserPayload

  ): Promise<PaginatedStudents> {

    const where = this.buildListWhere(query, actor);



    const [total, items] = await Promise.all([

      prisma.student.count({ where }),

      prisma.student.findMany({

        where,

        include: studentInclude,

        orderBy: { [query.sortBy]: query.sortOrder },

        skip: (query.page - 1) * query.limit,

        take: query.limit,

      }),

    ]);



    return {

      items,

      meta: {

        page: query.page,

        limit: query.limit,

        total,

        totalPages: Math.max(1, Math.ceil(total / query.limit)),

      },

    };

  }



  public async getById(id: string, actor: AuthUserPayload): Promise<StudentWithRelations> {

    const student = await prisma.student.findUnique({

      where: { id },

      include: studentInclude,

    });



    if (!student) {

      throw new AppError('Student not found', 404);

    }



    this.assertCanAccessStudent(actor, student);

    return student;

  }



  public async update(

    id: string,

    payload: UpdateStudentInput,

    actor: AuthUserPayload

  ): Promise<StudentWithRelations> {

    this.assertCanMutate(actor);

    const existing = await this.getById(id, actor);



    if (payload.departmentId || payload.courseId || payload.semesterId) {

      await this.assertAcademicHierarchy(

        existing.collegeId,

        payload.departmentId ?? existing.departmentId,

        payload.courseId ?? existing.courseId,

        payload.semesterId ?? existing.semesterId

      );

    }



    await this.assertUniqueFields(

      existing.collegeId,

      {

        email: payload.email,

        rollNumber: payload.rollNumber,

        registrationNumber: payload.registrationNumber,

      },

      existing.id

    );



    try {

      return await prisma.student.update({

        where: { id },

        data: {

          ...(payload.departmentId !== undefined && { departmentId: payload.departmentId }),

          ...(payload.courseId !== undefined && { courseId: payload.courseId }),

          ...(payload.semesterId !== undefined && { semesterId: payload.semesterId }),

          ...(payload.userId !== undefined && { userId: payload.userId }),

          ...(payload.firstName !== undefined && { firstName: payload.firstName }),

          ...(payload.lastName !== undefined && { lastName: payload.lastName }),

          ...(payload.gender !== undefined && { gender: payload.gender as Gender }),

          ...(payload.dateOfBirth !== undefined && { dateOfBirth: payload.dateOfBirth }),

          ...(payload.email !== undefined && { email: payload.email }),

          ...(payload.phone !== undefined && { phone: payload.phone }),

          ...(payload.address !== undefined && { address: payload.address }),

          ...(payload.city !== undefined && { city: payload.city }),

          ...(payload.state !== undefined && { state: payload.state }),

          ...(payload.country !== undefined && { country: payload.country }),

          ...(payload.pincode !== undefined && { pincode: payload.pincode }),

          ...(payload.bloodGroup !== undefined && {

            bloodGroup: payload.bloodGroup as BloodGroup,

          }),

          ...(payload.admissionDate !== undefined && { admissionDate: payload.admissionDate }),

          ...(payload.rollNumber !== undefined && { rollNumber: payload.rollNumber }),

          ...(payload.registrationNumber !== undefined && {

            registrationNumber: payload.registrationNumber,

          }),

          ...(payload.profileImage !== undefined && { profileImage: payload.profileImage }),

          ...(payload.status !== undefined && { status: payload.status as StudentStatus }),

          ...(payload.guardianName !== undefined && { guardianName: payload.guardianName }),

          ...(payload.guardianPhone !== undefined && { guardianPhone: payload.guardianPhone }),

          ...(payload.guardianEmail !== undefined && { guardianEmail: payload.guardianEmail }),

        },

        include: studentInclude,

      });

    } catch (error) {

      this.handleUniqueConstraint(error);

      throw error;

    }

  }



  public async remove(id: string, actor: AuthUserPayload): Promise<void> {

    this.assertCanMutate(actor);

    await this.getById(id, actor);

    await prisma.student.delete({ where: { id } });

  }



  public async bulkDelete(payload: BulkIdsInput, actor: AuthUserPayload): Promise<number> {

    this.assertCanMutate(actor);

    const collegeId = this.requireCollegeScope(actor);



    const result = await prisma.student.deleteMany({

      where: { id: { in: payload.ids }, collegeId },

    });



    return result.count;

  }



  public async bulkUpdateStatus(

    payload: BulkStatusInput,

    actor: AuthUserPayload

  ): Promise<number> {

    this.assertCanMutate(actor);

    const collegeId = this.requireCollegeScope(actor);



    const result = await prisma.student.updateMany({

      where: { id: { in: payload.ids }, collegeId },

      data: { status: payload.status as StudentStatus },

    });



    return result.count;

  }



  public async exportStudents(

    query: ExportFormatInput,

    actor: AuthUserPayload

  ): Promise<{ buffer: Buffer; contentType: string; filename: string }> {

    const where = this.buildListWhere(

      {

        page: 1,

        limit: 10000,

        search: query.search,

        status: query.status,

        departmentId: query.departmentId,

        courseId: query.courseId,

        semesterId: query.semesterId,

        collegeId: query.collegeId,

        sortBy: 'createdAt',

        sortOrder: 'desc',

      },

      actor

    );



    const students = await prisma.student.findMany({

      where,

      include: studentInclude,

      orderBy: { createdAt: 'desc' },

      take: 10000,

    });



    const rows = students.map((student) => ({

      studentId: student.studentId,

      rollNumber: student.rollNumber,

      registrationNumber: student.registrationNumber,

      firstName: student.firstName,

      lastName: student.lastName,

      gender: student.gender,

      dateOfBirth: student.dateOfBirth.toISOString().slice(0, 10),

      email: student.email,

      phone: student.phone,

      address: student.address ?? '',

      city: student.city ?? '',

      state: student.state ?? '',

      country: student.country ?? '',

      pincode: student.pincode ?? '',

      bloodGroup: student.bloodGroup,

      admissionDate: student.admissionDate.toISOString().slice(0, 10),

      status: student.status,

      departmentCode: student.department.code,

      courseCode: student.course.code,

      semesterNumber: student.semester.semesterNumber,

      guardianName: student.guardianName ?? '',

      guardianPhone: student.guardianPhone ?? '',

      guardianEmail: student.guardianEmail ?? '',

    }));



    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');



    if (query.format === 'csv') {

      const csv = XLSX.utils.sheet_to_csv(worksheet);

      return {

        buffer: Buffer.from(csv, 'utf-8'),

        contentType: 'text/csv; charset=utf-8',

        filename: `students-${Date.now()}.csv`,

      };

    }



    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

    return {

      buffer,

      contentType:

        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

      filename: `students-${Date.now()}.xlsx`,

    };

  }



  public async importStudents(

    buffer: Buffer,

    actor: AuthUserPayload

  ): Promise<ImportResult> {

    this.assertCanMutate(actor);

    const collegeId = this.requireCollegeScope(actor);



    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });

    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {

      throw new AppError('Import file has no sheets', 400);

    }



    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(

      workbook.Sheets[sheetName],

      { defval: '' }

    );



    if (rows.length === 0) {

      throw new AppError('Import file has no data rows', 400);

    }



    const result: ImportResult = { created: 0, failed: 0, errors: [] };



    for (let index = 0; index < rows.length; index += 1) {

      const row = rows[index];

      const rowNumber = index + 2;



      try {

        const departmentCode = String(row.departmentCode ?? row.DepartmentCode ?? '').trim();

        const courseCode = String(row.courseCode ?? row.CourseCode ?? '').trim();

        const semesterNumber = Number(row.semesterNumber ?? row.SemesterNumber);



        if (!departmentCode || !courseCode || !Number.isFinite(semesterNumber)) {

          throw new Error('departmentCode, courseCode, and semesterNumber are required');

        }



        const department = await prisma.department.findFirst({

          where: { collegeId, code: departmentCode.toUpperCase() },

        });

        if (!department) throw new Error(`Department code ${departmentCode} not found`);



        const course = await prisma.course.findFirst({

          where: {

            collegeId,

            departmentId: department.id,

            code: courseCode.toUpperCase(),

          },

        });

        if (!course) throw new Error(`Course code ${courseCode} not found`);



        const semester = await prisma.semester.findFirst({

          where: { courseId: course.id, semesterNumber },

        });

        if (!semester) throw new Error(`Semester ${semesterNumber} not found for course`);



        const firstName = String(row.firstName ?? row.FirstName ?? '').trim();

        const lastName = String(row.lastName ?? row.LastName ?? '').trim();

        const email = String(row.email ?? row.Email ?? '')

          .trim()

          .toLowerCase();

        const phone = String(row.phone ?? row.Phone ?? '').trim();

        const gender = String(row.gender ?? row.Gender ?? 'OTHER')

          .trim()

          .toUpperCase();

        const dateOfBirthRaw = row.dateOfBirth ?? row.DateOfBirth;

        const dateOfBirth =

          dateOfBirthRaw instanceof Date

            ? dateOfBirthRaw

            : new Date(String(dateOfBirthRaw));



        if (!firstName || !lastName || !email || !phone || Number.isNaN(dateOfBirth.getTime())) {

          throw new Error('firstName, lastName, email, phone, and dateOfBirth are required');

        }



        await this.create(

          {

            departmentId: department.id,

            courseId: course.id,

            semesterId: semester.id,

            firstName,

            lastName,

            gender: gender as CreateStudentInput['gender'],

            dateOfBirth,

            email,

            phone,

            address: String(row.address ?? '') || null,

            city: String(row.city ?? '') || null,

            state: String(row.state ?? '') || null,

            country: String(row.country ?? '') || null,

            pincode: String(row.pincode ?? '') || null,

            bloodGroup: (String(row.bloodGroup ?? 'UNKNOWN').toUpperCase() ||

              'UNKNOWN') as CreateStudentInput['bloodGroup'],

            admissionDate: row.admissionDate

              ? new Date(String(row.admissionDate))

              : undefined,

            rollNumber: String(row.rollNumber ?? '').trim() || undefined,

            registrationNumber: String(row.registrationNumber ?? '').trim() || undefined,
            profileImage: null,

            status: (String(row.status ?? 'ACTIVE').toUpperCase() ||

              'ACTIVE') as CreateStudentInput['status'],

            guardianName: String(row.guardianName ?? '') || null,

            guardianPhone: String(row.guardianPhone ?? '') || null,

            guardianEmail: String(row.guardianEmail ?? '').toLowerCase() || null,

            collegeId,

          },

          actor

        );



        result.created += 1;

      } catch (error) {

        result.failed += 1;

        result.errors.push({

          row: rowNumber,

          message: error instanceof Error ? error.message : 'Import failed',

        });

      }

    }



    return result;

  }



  private buildListWhere(

    query: StudentQueryInput,

    actor: AuthUserPayload

  ): Prisma.StudentWhereInput {

    const where: Prisma.StudentWhereInput = {};



    if (actor.role === AppRole.STUDENT) {

      where.OR = [{ userId: actor.id }, { email: actor.email }];

      return where;

    }



    if (actor.role === AppRole.PARENT) {

      where.guardianEmail = actor.email;

      if (actor.collegeId) {

        where.collegeId = actor.collegeId;

      }

      return where;

    }



    const collegeId = this.resolveReadCollegeId(actor, query.collegeId);

    if (collegeId) {

      where.collegeId = collegeId;

    }



    if (query.status) where.status = query.status as StudentStatus;

    if (query.gender) where.gender = query.gender as Gender;

    if (query.departmentId) where.departmentId = query.departmentId;

    if (query.courseId) where.courseId = query.courseId;

    if (query.semesterId) where.semesterId = query.semesterId;



    if (query.admissionFrom || query.admissionTo) {

      where.admissionDate = {

        ...(query.admissionFrom ? { gte: query.admissionFrom } : {}),

        ...(query.admissionTo ? { lte: query.admissionTo } : {}),

      };

    }



    if (query.search) {

      where.OR = [

        { firstName: { contains: query.search, mode: 'insensitive' } },

        { lastName: { contains: query.search, mode: 'insensitive' } },

        { email: { contains: query.search, mode: 'insensitive' } },

        { phone: { contains: query.search, mode: 'insensitive' } },

        { studentId: { contains: query.search, mode: 'insensitive' } },

        { rollNumber: { contains: query.search, mode: 'insensitive' } },

        { registrationNumber: { contains: query.search, mode: 'insensitive' } },

      ];

    }



    return where;

  }



  private async assertAcademicHierarchy(

    collegeId: string,

    departmentId: string,

    courseId: string,

    semesterId: string

  ) {

    const department = await prisma.department.findUnique({ where: { id: departmentId } });

    if (!department || department.collegeId !== collegeId) {

      throw new AppError('Department not found in your college', 400);

    }



    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!course || course.collegeId !== collegeId || course.departmentId !== departmentId) {

      throw new AppError('Course must belong to the selected department', 400);

    }



    const semester = await prisma.semester.findUnique({ where: { id: semesterId } });

    if (!semester || semester.courseId !== courseId) {

      throw new AppError('Semester must belong to the selected course', 400);

    }



    return { department, course, semester };

  }



  private async generateStudentId(collegeCode: string): Promise<string> {

    const year = new Date().getFullYear();

    const prefix = `${collegeCode.toUpperCase()}-STU-${year}`;

    const latest = await prisma.student.findFirst({

      where: { studentId: { startsWith: prefix } },

      orderBy: { studentId: 'desc' },

      select: { studentId: true },

    });



    let next = 1;

    if (latest?.studentId) {

      const tail = latest.studentId.slice(prefix.length);

      const parsed = Number.parseInt(tail, 10);

      if (!Number.isNaN(parsed)) next = parsed + 1;

    }



    return `${prefix}${String(next).padStart(4, '0')}`;

  }



  private async generateRollNumber(

    collegeId: string,

    departmentCode: string,

    courseCode: string

  ): Promise<string> {

    const year = new Date().getFullYear();

    const prefix = `${departmentCode}-${courseCode}-${year}-`.toUpperCase();

    const latest = await prisma.student.findFirst({

      where: { collegeId, rollNumber: { startsWith: prefix } },

      orderBy: { rollNumber: 'desc' },

      select: { rollNumber: true },

    });



    let next = 1;

    if (latest?.rollNumber) {

      const tail = latest.rollNumber.slice(prefix.length);

      const parsed = Number.parseInt(tail, 10);

      if (!Number.isNaN(parsed)) next = parsed + 1;

    }



    return `${prefix}${String(next).padStart(3, '0')}`;

  }



  private async generateRegistrationNumber(

    collegeId: string,

    collegeCode: string

  ): Promise<string> {

    const year = new Date().getFullYear();

    const prefix = `REG-${collegeCode.toUpperCase()}-${year}`;

    const latest = await prisma.student.findFirst({

      where: { collegeId, registrationNumber: { startsWith: prefix } },

      orderBy: { registrationNumber: 'desc' },

      select: { registrationNumber: true },

    });



    let next = 1;

    if (latest?.registrationNumber) {

      const tail = latest.registrationNumber.slice(prefix.length);

      const parsed = Number.parseInt(tail, 10);

      if (!Number.isNaN(parsed)) next = parsed + 1;

    }



    return `${prefix}${String(next).padStart(4, '0')}`;

  }



  private async assertUniqueFields(

    collegeId: string,

    fields: {

      email?: string;

      rollNumber?: string;

      registrationNumber?: string;

    },

    excludeId?: string

  ): Promise<void> {

    if (fields.email) {

      const existing = await prisma.student.findFirst({

        where: {

          collegeId,

          email: fields.email,

          ...(excludeId ? { id: { not: excludeId } } : {}),

        },

      });

      if (existing) throw new AppError('Student email already exists in this college', 409);

    }



    if (fields.rollNumber) {

      const existing = await prisma.student.findFirst({

        where: {

          collegeId,

          rollNumber: fields.rollNumber,

          ...(excludeId ? { id: { not: excludeId } } : {}),

        },

      });

      if (existing) throw new AppError('Roll number already exists in this college', 409);

    }



    if (fields.registrationNumber) {

      const existing = await prisma.student.findFirst({

        where: {

          collegeId,

          registrationNumber: fields.registrationNumber,

          ...(excludeId ? { id: { not: excludeId } } : {}),

        },

      });

      if (existing) {

        throw new AppError('Registration number already exists in this college', 409);

      }

    }

  }



  private resolveWriteCollegeId(actor: AuthUserPayload, requested?: string): string {

    if (actor.role === AppRole.SUPER_ADMIN) {

      if (!requested) throw new AppError('collegeId is required for Super Admin', 400);

      return requested;

    }

    if (!actor.collegeId) {

      throw new AppError('Your account is not linked to a college', 403);

    }

    if (requested && requested !== actor.collegeId) {

      throw new AppError('Cross-college access is not allowed', 403);

    }

    return actor.collegeId;

  }



  private resolveReadCollegeId(

    actor: AuthUserPayload,

    requested?: string

  ): string | undefined {

    if (actor.role === AppRole.SUPER_ADMIN) return requested;

    if (!actor.collegeId) {

      throw new AppError('Your account is not linked to a college', 403);

    }

    if (requested && requested !== actor.collegeId) {

      throw new AppError('Cross-college access is not allowed', 403);

    }

    return actor.collegeId;

  }



  private requireCollegeScope(actor: AuthUserPayload): string {

    if (actor.role === AppRole.SUPER_ADMIN) {

      throw new AppError('This operation requires a college-scoped account', 400);

    }

    if (!actor.collegeId) {

      throw new AppError('Your account is not linked to a college', 403);

    }

    return actor.collegeId;

  }



  private assertCanMutate(actor: AuthUserPayload): void {

    if (actor.role === AppRole.SUPER_ADMIN || actor.role === AppRole.COLLEGE_ADMIN) {

      return;

    }

    throw new AppError('You do not have permission to modify students', 403);

  }



  private assertCanAccessStudent(actor: AuthUserPayload, student: Student): void {

    if (actor.role === AppRole.SUPER_ADMIN) return;



    if (actor.role === AppRole.STUDENT) {

      const owns =

        student.userId === actor.id ||

        student.email.toLowerCase() === actor.email.toLowerCase();

      if (!owns) throw new AppError('You can only view your own student profile', 403);

      return;

    }



    if (actor.role === AppRole.PARENT) {

      if (

        !student.guardianEmail ||

        student.guardianEmail.toLowerCase() !== actor.email.toLowerCase()

      ) {

        throw new AppError('You can only view your linked children', 403);

      }

      return;

    }



    if (!actor.collegeId || actor.collegeId !== student.collegeId) {

      throw new AppError('Cross-college access is not allowed', 403);

    }

  }



  private handleUniqueConstraint(error: unknown): void {

    if (

      error instanceof Prisma.PrismaClientKnownRequestError &&

      error.code === 'P2002'

    ) {

      const target = (error.meta?.target as string[] | undefined) ?? [];

      if (target.includes('email')) {

        throw new AppError('Student email already exists in this college', 409);

      }

      if (target.includes('rollNumber')) {

        throw new AppError('Roll number already exists in this college', 409);

      }

      if (target.includes('registrationNumber')) {

        throw new AppError('Registration number already exists in this college', 409);

      }

      if (target.includes('studentId')) {

        throw new AppError('Generated student ID conflict. Please retry.', 409);

      }

      throw new AppError('Student already exists', 409);

    }

  }

}



export const studentService = new StudentService();

