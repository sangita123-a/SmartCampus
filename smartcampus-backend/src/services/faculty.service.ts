import {
  BloodGroup,
  EmploymentType,
  Faculty,
  FacultyStatus,
  Gender,
  Prisma,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as XLSX from 'xlsx';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { AuthUserPayload } from '../types/express';
import { Role as AppRole } from '../types/roles';
import {
  BulkFacultyIdsInput,
  BulkFacultyStatusInput,
  CreateFacultyInput,
  FacultyExportInput,
  FacultyQueryInput,
  UpdateFacultyInput,
} from '../validators/faculty.validator';

export type FacultyWithRelations = Faculty & {
  department: { id: string; name: string; code: string };
  college?: { id: string; name: string; code: string };
};

export interface PaginatedFaculty {
  items: FacultyWithRelations[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FacultyDashboardStats {
  totalFaculty: number;
  activeFaculty: number;
  inactiveFaculty: number;
  newFaculty: number;
  facultyByDepartment: Array<{
    departmentId: string;
    departmentName: string;
    count: number;
  }>;
  college: { id: string; name: string; code: string } | null;
}

export interface ImportResult {
  created: number;
  failed: number;
  errors: Array<{ row: number; message: string }>;
}

const facultyInclude = {
  department: { select: { id: true, name: true, code: true } },
  college: { select: { id: true, name: true, code: true } },
} satisfies Prisma.FacultyInclude;

export class FacultyService {
  public async getDashboardStats(actor: AuthUserPayload): Promise<FacultyDashboardStats> {
    const collegeId = this.requireCollegeScope(actor);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalFaculty, activeFaculty, inactiveFaculty, newFaculty, grouped, college] =
      await Promise.all([
        prisma.faculty.count({ where: { collegeId } }),
        prisma.faculty.count({ where: { collegeId, status: FacultyStatus.ACTIVE } }),
        prisma.faculty.count({
          where: {
            collegeId,
            status: { in: [FacultyStatus.INACTIVE, FacultyStatus.TERMINATED] },
          },
        }),
        prisma.faculty.count({
          where: { collegeId, joiningDate: { gte: thirtyDaysAgo } },
        }),
        prisma.faculty.groupBy({
          by: ['departmentId'],
          where: { collegeId },
          _count: { _all: true },
        }),
        prisma.college.findUnique({
          where: { id: collegeId },
          select: { id: true, name: true, code: true },
        }),
      ]);

    const departments = await prisma.department.findMany({
      where: { id: { in: grouped.map((item) => item.departmentId) } },
      select: { id: true, name: true },
    });
    const departmentNameById = new Map(departments.map((item) => [item.id, item.name]));

    return {
      totalFaculty,
      activeFaculty,
      inactiveFaculty,
      newFaculty,
      facultyByDepartment: grouped.map((item) => ({
        departmentId: item.departmentId,
        departmentName: departmentNameById.get(item.departmentId) ?? 'Unknown',
        count: item._count._all,
      })),
      college,
    };
  }

  public async create(
    payload: CreateFacultyInput,
    actor: AuthUserPayload
  ): Promise<FacultyWithRelations> {
    this.assertCanMutate(actor);
    const collegeId = this.resolveWriteCollegeId(actor, payload.collegeId);
    await this.assertDepartmentInCollege(collegeId, payload.departmentId);

    const college = await prisma.college.findUniqueOrThrow({ where: { id: collegeId } });
    const facultyId = await this.generateFacultyId(college.code);
    const employeeId =
      payload.employeeId?.trim() || (await this.generateEmployeeId(collegeId, college.code));

    await this.assertUniqueFields(collegeId, {
      email: payload.email,
      employeeId,
    });

    try {
      return await prisma.faculty.create({
        data: {
          facultyId,
          collegeId,
          departmentId: payload.departmentId,
          employeeId,
          userId: payload.userId ?? null,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          phone: payload.phone,
          gender: payload.gender as Gender,
          dateOfBirth: payload.dateOfBirth ?? null,
          qualification: payload.qualification ?? null,
          experience: payload.experience ?? 0,
          designation: payload.designation,
          joiningDate: payload.joiningDate ?? new Date(),
          employmentType:
            (payload.employmentType as EmploymentType | undefined) ?? EmploymentType.FULL_TIME,
          salary:
            payload.salary === undefined || payload.salary === null
              ? null
              : new Decimal(payload.salary),
          bloodGroup: (payload.bloodGroup as BloodGroup | undefined) ?? BloodGroup.UNKNOWN,
          address: payload.address ?? null,
          city: payload.city ?? null,
          state: payload.state ?? null,
          country: payload.country ?? null,
          pincode: payload.pincode ?? null,
          profileImage: payload.profileImage ?? null,
          status: (payload.status as FacultyStatus | undefined) ?? FacultyStatus.ACTIVE,
        },
        include: facultyInclude,
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  public async list(
    query: FacultyQueryInput,
    actor: AuthUserPayload
  ): Promise<PaginatedFaculty> {
    const where = this.buildListWhere(query, actor);

    const [total, items] = await Promise.all([
      prisma.faculty.count({ where }),
      prisma.faculty.findMany({
        where,
        include: facultyInclude,
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

  public async getById(id: string, actor: AuthUserPayload): Promise<FacultyWithRelations> {
    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: facultyInclude,
    });

    if (!faculty) {
      throw new AppError('Faculty not found', 404);
    }

    this.assertCanAccessFaculty(actor, faculty);
    return faculty;
  }

  public async update(
    id: string,
    payload: UpdateFacultyInput,
    actor: AuthUserPayload
  ): Promise<FacultyWithRelations> {
    this.assertCanMutate(actor);
    const existing = await this.getById(id, actor);

    if (payload.departmentId) {
      await this.assertDepartmentInCollege(existing.collegeId, payload.departmentId);
    }

    await this.assertUniqueFields(
      existing.collegeId,
      {
        email: payload.email,
        employeeId: payload.employeeId,
      },
      existing.id
    );

    try {
      return await prisma.faculty.update({
        where: { id },
        data: {
          ...(payload.departmentId !== undefined && { departmentId: payload.departmentId }),
          ...(payload.userId !== undefined && { userId: payload.userId }),
          ...(payload.firstName !== undefined && { firstName: payload.firstName }),
          ...(payload.lastName !== undefined && { lastName: payload.lastName }),
          ...(payload.email !== undefined && { email: payload.email }),
          ...(payload.phone !== undefined && { phone: payload.phone }),
          ...(payload.gender !== undefined && { gender: payload.gender as Gender }),
          ...(payload.dateOfBirth !== undefined && { dateOfBirth: payload.dateOfBirth }),
          ...(payload.qualification !== undefined && { qualification: payload.qualification }),
          ...(payload.experience !== undefined && { experience: payload.experience }),
          ...(payload.designation !== undefined && { designation: payload.designation }),
          ...(payload.joiningDate !== undefined && { joiningDate: payload.joiningDate }),
          ...(payload.employmentType !== undefined && {
            employmentType: payload.employmentType as EmploymentType,
          }),
          ...(payload.salary !== undefined && {
            salary: payload.salary === null ? null : new Decimal(payload.salary),
          }),
          ...(payload.bloodGroup !== undefined && {
            bloodGroup: payload.bloodGroup as BloodGroup,
          }),
          ...(payload.address !== undefined && { address: payload.address }),
          ...(payload.city !== undefined && { city: payload.city }),
          ...(payload.state !== undefined && { state: payload.state }),
          ...(payload.country !== undefined && { country: payload.country }),
          ...(payload.pincode !== undefined && { pincode: payload.pincode }),
          ...(payload.profileImage !== undefined && { profileImage: payload.profileImage }),
          ...(payload.status !== undefined && { status: payload.status as FacultyStatus }),
          ...(payload.employeeId !== undefined && { employeeId: payload.employeeId }),
        },
        include: facultyInclude,
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  public async remove(id: string, actor: AuthUserPayload): Promise<void> {
    this.assertCanMutate(actor);
    await this.getById(id, actor);
    await prisma.faculty.delete({ where: { id } });
  }

  public async bulkDelete(payload: BulkFacultyIdsInput, actor: AuthUserPayload): Promise<number> {
    this.assertCanMutate(actor);
    const collegeId = this.requireCollegeScope(actor);
    const result = await prisma.faculty.deleteMany({
      where: { id: { in: payload.ids }, collegeId },
    });
    return result.count;
  }

  public async bulkUpdateStatus(
    payload: BulkFacultyStatusInput,
    actor: AuthUserPayload
  ): Promise<number> {
    this.assertCanMutate(actor);
    const collegeId = this.requireCollegeScope(actor);
    const result = await prisma.faculty.updateMany({
      where: { id: { in: payload.ids }, collegeId },
      data: { status: payload.status as FacultyStatus },
    });
    return result.count;
  }

  public async exportFaculty(
    query: FacultyExportInput,
    actor: AuthUserPayload
  ): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    const where = this.buildListWhere(
      {
        page: 1,
        limit: 10000,
        search: query.search,
        status: query.status,
        designation: query.designation,
        departmentId: query.departmentId,
        collegeId: query.collegeId,
        recentlyJoined: query.recentlyJoined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
      actor
    );

    const faculty = await prisma.faculty.findMany({
      where,
      include: facultyInclude,
      orderBy: { createdAt: 'desc' },
      take: 10000,
    });

    const rows = faculty.map((item) => ({
      facultyId: item.facultyId,
      employeeId: item.employeeId,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phone: item.phone,
      gender: item.gender,
      dateOfBirth: item.dateOfBirth ? item.dateOfBirth.toISOString().slice(0, 10) : '',
      qualification: item.qualification ?? '',
      experience: item.experience,
      designation: item.designation,
      joiningDate: item.joiningDate.toISOString().slice(0, 10),
      employmentType: item.employmentType,
      salary: item.salary ? item.salary.toString() : '',
      bloodGroup: item.bloodGroup,
      address: item.address ?? '',
      city: item.city ?? '',
      state: item.state ?? '',
      country: item.country ?? '',
      pincode: item.pincode ?? '',
      status: item.status,
      departmentCode: item.department.code,
      departmentName: item.department.name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Faculty');

    if (query.format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      return {
        buffer: Buffer.from(csv, 'utf-8'),
        contentType: 'text/csv; charset=utf-8',
        filename: `faculty-${Date.now()}.csv`,
      };
    }

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
    return {
      buffer,
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename: `faculty-${Date.now()}.xlsx`,
    };
  }

  public async importFaculty(buffer: Buffer, actor: AuthUserPayload): Promise<ImportResult> {
    this.assertCanMutate(actor);
    const collegeId = this.requireCollegeScope(actor);

    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new AppError('Import file has no sheets', 400);

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
      workbook.Sheets[sheetName],
      { defval: '' }
    );
    if (rows.length === 0) throw new AppError('Import file has no data rows', 400);

    const result: ImportResult = { created: 0, failed: 0, errors: [] };

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const rowNumber = index + 2;

      try {
        const departmentCode = String(row.departmentCode ?? row.DepartmentCode ?? '')
          .trim()
          .toUpperCase();
        if (!departmentCode) throw new Error('departmentCode is required');

        const department = await prisma.department.findFirst({
          where: { collegeId, code: departmentCode },
        });
        if (!department) throw new Error(`Department code ${departmentCode} not found`);

        const firstName = String(row.firstName ?? row.FirstName ?? '').trim();
        const lastName = String(row.lastName ?? row.LastName ?? '').trim();
        const email = String(row.email ?? row.Email ?? '')
          .trim()
          .toLowerCase();
        const phone = String(row.phone ?? row.Phone ?? '').trim();
        const designation = String(row.designation ?? row.Designation ?? '').trim();
        const gender = String(row.gender ?? row.Gender ?? 'OTHER')
          .trim()
          .toUpperCase();

        if (!firstName || !lastName || !email || !phone || !designation) {
          throw new Error('firstName, lastName, email, phone, and designation are required');
        }

        await this.create(
          {
            departmentId: department.id,
            firstName,
            lastName,
            email,
            phone,
            gender: gender as CreateFacultyInput['gender'],
            dateOfBirth: row.dateOfBirth
              ? new Date(String(row.dateOfBirth))
              : null,
            qualification: String(row.qualification ?? '') || null,
            experience: Number(row.experience ?? 0) || 0,
            designation,
            joiningDate: row.joiningDate
              ? new Date(String(row.joiningDate))
              : undefined,
            employmentType: (String(row.employmentType ?? 'FULL_TIME')
              .trim()
              .toUpperCase() || 'FULL_TIME') as CreateFacultyInput['employmentType'],
            salary: row.salary === '' || row.salary === undefined ? null : Number(row.salary),
            bloodGroup: (String(row.bloodGroup ?? 'UNKNOWN').toUpperCase() ||
              'UNKNOWN') as CreateFacultyInput['bloodGroup'],
            address: String(row.address ?? '') || null,
            city: String(row.city ?? '') || null,
            state: String(row.state ?? '') || null,
            country: String(row.country ?? '') || null,
            pincode: String(row.pincode ?? '') || null,
            profileImage: undefined,
            status: (String(row.status ?? 'ACTIVE').toUpperCase() ||
              'ACTIVE') as CreateFacultyInput['status'],
            employeeId: String(row.employeeId ?? '').trim() || undefined,
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
    query: FacultyQueryInput,
    actor: AuthUserPayload
  ): Prisma.FacultyWhereInput {
    const where: Prisma.FacultyWhereInput = {};

    if (actor.role === AppRole.FACULTY) {
      where.OR = [{ userId: actor.id }, { email: actor.email }];
      return where;
    }

    if (actor.role === AppRole.STUDENT || actor.role === AppRole.PARENT) {
      throw new AppError('You do not have permission to access faculty records', 403);
    }

    const collegeId = this.resolveReadCollegeId(actor, query.collegeId);
    if (collegeId) where.collegeId = collegeId;

    if (query.status) where.status = query.status as FacultyStatus;
    if (query.designation) {
      where.designation = { contains: query.designation, mode: 'insensitive' };
    }
    if (query.employmentType) {
      where.employmentType = query.employmentType as EmploymentType;
    }
    if (query.departmentId) where.departmentId = query.departmentId;

    if (query.recentlyJoined) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      where.joiningDate = { gte: thirtyDaysAgo };
    }

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
        { facultyId: { contains: query.search, mode: 'insensitive' } },
        { employeeId: { contains: query.search, mode: 'insensitive' } },
        { designation: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private async assertDepartmentInCollege(collegeId: string, departmentId: string) {
    const department = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!department || department.collegeId !== collegeId) {
      throw new AppError('Department not found in your college', 400);
    }
    return department;
  }

  private async generateFacultyId(collegeCode: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `${collegeCode.toUpperCase()}-FAC-${year}`;
    const latest = await prisma.faculty.findFirst({
      where: { facultyId: { startsWith: prefix } },
      orderBy: { facultyId: 'desc' },
      select: { facultyId: true },
    });

    let next = 1;
    if (latest?.facultyId) {
      const parsed = Number.parseInt(latest.facultyId.slice(prefix.length), 10);
      if (!Number.isNaN(parsed)) next = parsed + 1;
    }

    return `${prefix}${String(next).padStart(4, '0')}`;
  }

  private async generateEmployeeId(collegeId: string, collegeCode: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `EMP-${collegeCode.toUpperCase()}-${year}`;
    const latest = await prisma.faculty.findFirst({
      where: { collegeId, employeeId: { startsWith: prefix } },
      orderBy: { employeeId: 'desc' },
      select: { employeeId: true },
    });

    let next = 1;
    if (latest?.employeeId) {
      const parsed = Number.parseInt(latest.employeeId.slice(prefix.length), 10);
      if (!Number.isNaN(parsed)) next = parsed + 1;
    }

    return `${prefix}${String(next).padStart(4, '0')}`;
  }

  private async assertUniqueFields(
    collegeId: string,
    fields: { email?: string; employeeId?: string },
    excludeId?: string
  ): Promise<void> {
    if (fields.email) {
      const existing = await prisma.faculty.findFirst({
        where: {
          collegeId,
          email: fields.email,
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
      });
      if (existing) throw new AppError('Faculty email already exists in this college', 409);
    }

    if (fields.employeeId) {
      const existing = await prisma.faculty.findFirst({
        where: {
          collegeId,
          employeeId: fields.employeeId,
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
      });
      if (existing) throw new AppError('Employee ID already exists in this college', 409);
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
    if (actor.role === AppRole.SUPER_ADMIN || actor.role === AppRole.COLLEGE_ADMIN) return;
    throw new AppError('You do not have permission to modify faculty', 403);
  }

  private assertCanAccessFaculty(actor: AuthUserPayload, faculty: Faculty): void {
    if (actor.role === AppRole.SUPER_ADMIN) return;

    if (actor.role === AppRole.FACULTY) {
      const owns =
        faculty.userId === actor.id ||
        faculty.email.toLowerCase() === actor.email.toLowerCase();
      if (!owns) throw new AppError('You can only view your own faculty profile', 403);
      return;
    }

    if (actor.role === AppRole.STUDENT || actor.role === AppRole.PARENT) {
      throw new AppError('You do not have permission to access faculty records', 403);
    }

    if (!actor.collegeId || actor.collegeId !== faculty.collegeId) {
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
        throw new AppError('Faculty email already exists in this college', 409);
      }
      if (target.includes('employeeId')) {
        throw new AppError('Employee ID already exists in this college', 409);
      }
      if (target.includes('facultyId')) {
        throw new AppError('Generated faculty ID conflict. Please retry.', 409);
      }
      throw new AppError('Faculty already exists', 409);
    }
  }
}

export const facultyService = new FacultyService();
