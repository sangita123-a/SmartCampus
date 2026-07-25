import { AcademicStatus, Prisma, Subject } from '@prisma/client';
import * as XLSX from 'xlsx';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { AuthUserPayload } from '../types/express';
import { Role as AppRole } from '../types/roles';
import {
  AssignFacultyInput,
  BulkSubjectIdsInput,
  BulkSubjectStatusInput,
  CreateSubjectInput,
  SubjectExportInput,
  SubjectQueryInput,
  UpdateSubjectInput,
} from '../validators/subject.validator';

export type SubjectWithRelations = Subject & {
  department: { id: string; name: string; code: string };
  course: { id: string; name: string; code: string };
  semester: { id: string; name: string; semesterNumber: number };
  faculty: {
    id: string;
    firstName: string;
    lastName: string;
    facultyId: string;
    employeeId: string;
  } | null;
  college?: { id: string; name: string; code: string };
};

export interface PaginatedSubjects {
  items: SubjectWithRelations[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SubjectDashboardStats {
  totalSubjects: number;
  assignedSubjects: number;
  unassignedSubjects: number;
  activeSubjects: number;
  subjectsByDepartment: Array<{
    departmentId: string;
    departmentName: string;
    count: number;
  }>;
  subjectsBySemester: Array<{
    semesterId: string;
    semesterName: string;
    count: number;
  }>;
  college: { id: string; name: string; code: string } | null;
}

const subjectInclude = {
  department: { select: { id: true, name: true, code: true } },
  course: { select: { id: true, name: true, code: true } },
  semester: { select: { id: true, name: true, semesterNumber: true } },
  faculty: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      facultyId: true,
      employeeId: true,
    },
  },
  college: { select: { id: true, name: true, code: true } },
} satisfies Prisma.SubjectInclude;

export class SubjectService {
  public async getDashboardStats(actor: AuthUserPayload): Promise<SubjectDashboardStats> {
    const collegeId = this.requireCollegeScope(actor);

    const [
      totalSubjects,
      assignedSubjects,
      unassignedSubjects,
      activeSubjects,
      byDepartment,
      bySemester,
      college,
    ] = await Promise.all([
      prisma.subject.count({ where: { collegeId } }),
      prisma.subject.count({ where: { collegeId, facultyId: { not: null } } }),
      prisma.subject.count({ where: { collegeId, facultyId: null } }),
      prisma.subject.count({ where: { collegeId, status: AcademicStatus.ACTIVE } }),
      prisma.subject.groupBy({
        by: ['departmentId'],
        where: { collegeId },
        _count: { _all: true },
      }),
      prisma.subject.groupBy({
        by: ['semesterId'],
        where: { collegeId },
        _count: { _all: true },
      }),
      prisma.college.findUnique({
        where: { id: collegeId },
        select: { id: true, name: true, code: true },
      }),
    ]);

    const departments = await prisma.department.findMany({
      where: { id: { in: byDepartment.map((item) => item.departmentId) } },
      select: { id: true, name: true },
    });
    const semesters = await prisma.semester.findMany({
      where: { id: { in: bySemester.map((item) => item.semesterId) } },
      select: { id: true, name: true },
    });

    const deptNames = new Map(departments.map((item) => [item.id, item.name]));
    const semNames = new Map(semesters.map((item) => [item.id, item.name]));

    return {
      totalSubjects,
      assignedSubjects,
      unassignedSubjects,
      activeSubjects,
      subjectsByDepartment: byDepartment.map((item) => ({
        departmentId: item.departmentId,
        departmentName: deptNames.get(item.departmentId) ?? 'Unknown',
        count: item._count._all,
      })),
      subjectsBySemester: bySemester.map((item) => ({
        semesterId: item.semesterId,
        semesterName: semNames.get(item.semesterId) ?? 'Unknown',
        count: item._count._all,
      })),
      college,
    };
  }

  public async create(
    payload: CreateSubjectInput,
    actor: AuthUserPayload
  ): Promise<SubjectWithRelations> {
    this.assertCanMutate(actor);
    const collegeId = this.resolveWriteCollegeId(actor, payload.collegeId);
    await this.assertAcademicHierarchy(
      collegeId,
      payload.departmentId,
      payload.courseId,
      payload.semesterId
    );

    if (payload.facultyId) {
      await this.assertFacultyInCollege(collegeId, payload.facultyId);
    }

    const subjectCode = payload.subjectCode?.trim().toUpperCase() || (await this.generateSubjectCode());
    await this.assertUniqueFields(collegeId, payload.semesterId, {
      subjectCode,
      subjectName: payload.subjectName,
    });

    const theoryHours = payload.theoryHours ?? 0;
    const practicalHours = payload.practicalHours ?? 0;

    try {
      return await prisma.subject.create({
        data: {
          subjectCode,
          subjectName: payload.subjectName,
          shortName: payload.shortName ?? null,
          credits: payload.credits,
          theoryHours,
          practicalHours,
          totalHours: theoryHours + practicalHours,
          departmentId: payload.departmentId,
          courseId: payload.courseId,
          semesterId: payload.semesterId,
          facultyId: payload.facultyId ?? null,
          collegeId,
          description: payload.description ?? null,
          status: (payload.status as AcademicStatus | undefined) ?? AcademicStatus.ACTIVE,
        },
        include: subjectInclude,
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  public async list(
    query: SubjectQueryInput,
    actor: AuthUserPayload
  ): Promise<PaginatedSubjects> {
    const where = await this.buildListWhere(query, actor);

    const [total, items] = await Promise.all([
      prisma.subject.count({ where }),
      prisma.subject.findMany({
        where,
        include: subjectInclude,
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

  public async getById(id: string, actor: AuthUserPayload): Promise<SubjectWithRelations> {
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: subjectInclude,
    });

    if (!subject) throw new AppError('Subject not found', 404);
    await this.assertCanAccessSubject(actor, subject);
    return subject;
  }

  public async update(
    id: string,
    payload: UpdateSubjectInput,
    actor: AuthUserPayload
  ): Promise<SubjectWithRelations> {
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

    if (payload.facultyId) {
      await this.assertFacultyInCollege(existing.collegeId, payload.facultyId);
    }

    await this.assertUniqueFields(
      existing.collegeId,
      payload.semesterId ?? existing.semesterId,
      {
        subjectCode: payload.subjectCode,
        subjectName: payload.subjectName,
      },
      existing.id
    );

    const theoryHours = payload.theoryHours ?? existing.theoryHours;
    const practicalHours = payload.practicalHours ?? existing.practicalHours;

    try {
      return await prisma.subject.update({
        where: { id },
        data: {
          ...(payload.subjectName !== undefined && { subjectName: payload.subjectName }),
          ...(payload.shortName !== undefined && { shortName: payload.shortName }),
          ...(payload.credits !== undefined && { credits: payload.credits }),
          ...(payload.theoryHours !== undefined && { theoryHours: payload.theoryHours }),
          ...(payload.practicalHours !== undefined && {
            practicalHours: payload.practicalHours,
          }),
          totalHours: theoryHours + practicalHours,
          ...(payload.departmentId !== undefined && { departmentId: payload.departmentId }),
          ...(payload.courseId !== undefined && { courseId: payload.courseId }),
          ...(payload.semesterId !== undefined && { semesterId: payload.semesterId }),
          ...(payload.facultyId !== undefined && { facultyId: payload.facultyId }),
          ...(payload.description !== undefined && { description: payload.description }),
          ...(payload.status !== undefined && {
            status: payload.status as AcademicStatus,
          }),
          ...(payload.subjectCode !== undefined && {
            subjectCode: payload.subjectCode.toUpperCase(),
          }),
        },
        include: subjectInclude,
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  public async assignFaculty(
    id: string,
    payload: AssignFacultyInput,
    actor: AuthUserPayload
  ): Promise<SubjectWithRelations> {
    this.assertCanMutate(actor);
    const existing = await this.getById(id, actor);
    await this.assertFacultyInCollege(existing.collegeId, payload.facultyId);

    return prisma.subject.update({
      where: { id },
      data: { facultyId: payload.facultyId },
      include: subjectInclude,
    });
  }

  public async removeFaculty(
    id: string,
    actor: AuthUserPayload
  ): Promise<SubjectWithRelations> {
    this.assertCanMutate(actor);
    await this.getById(id, actor);

    return prisma.subject.update({
      where: { id },
      data: { facultyId: null },
      include: subjectInclude,
    });
  }

  public async remove(id: string, actor: AuthUserPayload): Promise<void> {
    this.assertCanMutate(actor);
    await this.getById(id, actor);
    await prisma.subject.delete({ where: { id } });
  }

  public async bulkDelete(payload: BulkSubjectIdsInput, actor: AuthUserPayload): Promise<number> {
    this.assertCanMutate(actor);
    const collegeId = this.requireCollegeScope(actor);
    const result = await prisma.subject.deleteMany({
      where: { id: { in: payload.ids }, collegeId },
    });
    return result.count;
  }

  public async bulkUpdateStatus(
    payload: BulkSubjectStatusInput,
    actor: AuthUserPayload
  ): Promise<number> {
    this.assertCanMutate(actor);
    const collegeId = this.requireCollegeScope(actor);
    const result = await prisma.subject.updateMany({
      where: { id: { in: payload.ids }, collegeId },
      data: { status: payload.status as AcademicStatus },
    });
    return result.count;
  }

  public async exportSubjects(
    query: SubjectExportInput,
    actor: AuthUserPayload
  ): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    const where = await this.buildListWhere(
      {
        page: 1,
        limit: 10000,
        search: query.search,
        status: query.status,
        departmentId: query.departmentId,
        courseId: query.courseId,
        semesterId: query.semesterId,
        facultyId: query.facultyId,
        collegeId: query.collegeId,
        assignment: query.assignment,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
      actor
    );

    const subjects = await prisma.subject.findMany({
      where,
      include: subjectInclude,
      orderBy: { createdAt: 'desc' },
      take: 10000,
    });

    const rows = subjects.map((item) => ({
      subjectCode: item.subjectCode,
      subjectName: item.subjectName,
      shortName: item.shortName ?? '',
      credits: item.credits,
      theoryHours: item.theoryHours,
      practicalHours: item.practicalHours,
      totalHours: item.totalHours,
      department: item.department.name,
      course: item.course.name,
      semester: item.semester.name,
      faculty: item.faculty
        ? `${item.faculty.firstName} ${item.faculty.lastName}`
        : '',
      status: item.status,
      description: item.description ?? '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Subjects');

    if (query.format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      return {
        buffer: Buffer.from(csv, 'utf-8'),
        contentType: 'text/csv; charset=utf-8',
        filename: `subjects-${Date.now()}.csv`,
      };
    }

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
    return {
      buffer,
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename: `subjects-${Date.now()}.xlsx`,
    };
  }

  private async buildListWhere(
    query: SubjectQueryInput,
    actor: AuthUserPayload
  ): Promise<Prisma.SubjectWhereInput> {
    const where: Prisma.SubjectWhereInput = {};

    if (actor.role === AppRole.PARENT) {
      throw new AppError('You do not have permission to access subjects', 403);
    }

    if (actor.role === AppRole.FACULTY) {
      const faculty = await prisma.faculty.findFirst({
        where: {
          OR: [{ userId: actor.id }, { email: actor.email }],
        },
        select: { id: true },
      });
      if (!faculty) {
        where.id = '__none__';
        return where;
      }
      where.facultyId = faculty.id;
      return where;
    }

    if (actor.role === AppRole.STUDENT) {
      if (!actor.collegeId) {
        throw new AppError('Your account is not linked to a college', 403);
      }
      where.collegeId = actor.collegeId;
      where.status = AcademicStatus.ACTIVE;

      const student = await prisma.student.findFirst({
        where: {
          OR: [{ userId: actor.id }, { email: actor.email }],
        },
        select: { courseId: true, semesterId: true },
      });
      if (student) {
        where.courseId = student.courseId;
        where.semesterId = student.semesterId;
      }
      return where;
    }

    const collegeId = this.resolveReadCollegeId(actor, query.collegeId);
    if (collegeId) where.collegeId = collegeId;

    if (query.status) where.status = query.status as AcademicStatus;
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.courseId) where.courseId = query.courseId;
    if (query.semesterId) where.semesterId = query.semesterId;
    if (query.facultyId) where.facultyId = query.facultyId;

    if (query.assignment === 'assigned') where.facultyId = { not: null };
    if (query.assignment === 'unassigned') where.facultyId = null;

    if (query.search) {
      where.OR = [
        { subjectCode: { contains: query.search, mode: 'insensitive' } },
        { subjectName: { contains: query.search, mode: 'insensitive' } },
        { shortName: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
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
  }

  private async assertFacultyInCollege(collegeId: string, facultyId: string) {
    const faculty = await prisma.faculty.findUnique({ where: { id: facultyId } });
    if (!faculty || faculty.collegeId !== collegeId) {
      throw new AppError('Faculty not found in your college', 400);
    }
  }

  private async generateSubjectCode(): Promise<string> {
    const latest = await prisma.subject.findFirst({
      where: { subjectCode: { startsWith: 'SUB' } },
      orderBy: { subjectCode: 'desc' },
      select: { subjectCode: true },
    });

    let next = 1;
    if (latest?.subjectCode) {
      const parsed = Number.parseInt(latest.subjectCode.replace(/^SUB/i, ''), 10);
      if (!Number.isNaN(parsed)) next = parsed + 1;
    }

    return `SUB${String(next).padStart(4, '0')}`;
  }

  private async assertUniqueFields(
    collegeId: string,
    semesterId: string,
    fields: { subjectCode?: string; subjectName?: string },
    excludeId?: string
  ): Promise<void> {
    if (fields.subjectCode) {
      const existing = await prisma.subject.findFirst({
        where: {
          subjectCode: fields.subjectCode,
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
      });
      if (existing) throw new AppError('Subject code already exists', 409);
    }

    if (fields.subjectName) {
      const existing = await prisma.subject.findFirst({
        where: {
          semesterId,
          subjectName: { equals: fields.subjectName, mode: 'insensitive' },
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
      });
      if (existing) {
        throw new AppError('Subject name already exists in this semester', 409);
      }
    }

    void collegeId;
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
    throw new AppError('You do not have permission to modify subjects', 403);
  }

  private async assertCanAccessSubject(
    actor: AuthUserPayload,
    subject: Subject
  ): Promise<void> {
    if (actor.role === AppRole.SUPER_ADMIN) return;

    if (actor.role === AppRole.PARENT) {
      throw new AppError('You do not have permission to access subjects', 403);
    }

    if (actor.role === AppRole.FACULTY) {
      const faculty = await prisma.faculty.findFirst({
        where: {
          OR: [{ userId: actor.id }, { email: actor.email }],
        },
        select: { id: true },
      });
      if (!faculty || subject.facultyId !== faculty.id) {
        throw new AppError('You can only view subjects assigned to you', 403);
      }
      return;
    }

    if (actor.role === AppRole.STUDENT) {
      if (!actor.collegeId || actor.collegeId !== subject.collegeId) {
        throw new AppError('Cross-college access is not allowed', 403);
      }
      return;
    }

    if (!actor.collegeId || actor.collegeId !== subject.collegeId) {
      throw new AppError('Cross-college access is not allowed', 403);
    }
  }

  private handleUniqueConstraint(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = (error.meta?.target as string[] | undefined) ?? [];
      if (target.includes('subjectCode')) {
        throw new AppError('Subject code already exists', 409);
      }
      if (target.includes('subjectName')) {
        throw new AppError('Subject name already exists in this semester', 409);
      }
      throw new AppError('Subject already exists', 409);
    }
  }
}

export const subjectService = new SubjectService();
