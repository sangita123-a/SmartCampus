import {

  AcademicStatus,

  Course,

  CourseType,

  Prisma,

} from '@prisma/client';

import { prisma } from '../config/database';

import { AppError } from '../utils/AppError';

import { AuthUserPayload } from '../types/express';

import { Role as AppRole } from '../types/roles';

import {

  CreateCourseInput,

  CourseQueryInput,

  UpdateCourseInput,

} from '../validators/course.validator';



export type CourseWithRelations = Course & {

  department: { id: string; name: string; code: string };

  _count: { semesters: number };

};



export interface PaginatedCourses {

  items: CourseWithRelations[];

  meta: {

    page: number;

    limit: number;

    total: number;

    totalPages: number;

  };

}



export class CourseService {

  public async create(payload: CreateCourseInput, actor: AuthUserPayload): Promise<Course> {

    const department = await this.getAccessibleDepartment(payload.departmentId, actor);

    const collegeId = department.collegeId;



    if (payload.collegeId && payload.collegeId !== collegeId) {

      throw new AppError('Course collegeId must match the department college', 400);

    }



    await this.assertUniqueCode(collegeId, payload.code);



    try {

      return await prisma.course.create({

        data: {

          departmentId: department.id,

          collegeId,

          name: payload.name,

          code: payload.code,

          duration: payload.duration,

          courseType:

            (payload.courseType as CourseType | undefined) ?? CourseType.UNDERGRADUATE,

          description: payload.description ?? null,

          status: (payload.status as AcademicStatus | undefined) ?? AcademicStatus.ACTIVE,

        },

      });

    } catch (error) {

      this.handleUniqueConstraint(error);

      throw error;

    }

  }



  public async list(

    query: CourseQueryInput,

    actor: AuthUserPayload

  ): Promise<PaginatedCourses> {

    const where = this.buildListWhere(query, actor);



    const [total, items] = await Promise.all([

      prisma.course.count({ where }),

      prisma.course.findMany({

        where,

        include: {

          department: { select: { id: true, name: true, code: true } },

          _count: { select: { semesters: true } },

        },

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



  public async getById(id: string, actor: AuthUserPayload): Promise<CourseWithRelations> {

    const course = await prisma.course.findUnique({

      where: { id },

      include: {

        department: { select: { id: true, name: true, code: true } },

        _count: { select: { semesters: true } },

      },

    });



    if (!course) {

      throw new AppError('Course not found', 404);

    }



    this.assertCanAccessCollege(actor, course.collegeId);

    return course;

  }



  public async update(

    id: string,

    payload: UpdateCourseInput,

    actor: AuthUserPayload

  ): Promise<Course> {

    this.assertCanMutate(actor);

    const existing = await this.getById(id, actor);



    let departmentId = existing.departmentId;

    let collegeId = existing.collegeId;



    if (payload.departmentId && payload.departmentId !== existing.departmentId) {

      const department = await this.getAccessibleDepartment(payload.departmentId, actor);

      if (department.collegeId !== existing.collegeId) {

        throw new AppError('Cannot move course to a department in another college', 403);

      }

      departmentId = department.id;

      collegeId = department.collegeId;

    }



    if (payload.code) {

      await this.assertUniqueCode(collegeId, payload.code, existing.id);

    }



    try {

      return await prisma.course.update({

        where: { id },

        data: {

          departmentId,

          collegeId,

          ...(payload.name !== undefined && { name: payload.name }),

          ...(payload.code !== undefined && { code: payload.code }),

          ...(payload.duration !== undefined && { duration: payload.duration }),

          ...(payload.courseType !== undefined && {

            courseType: payload.courseType as CourseType,

          }),

          ...(payload.description !== undefined && { description: payload.description }),

          ...(payload.status !== undefined && {

            status: payload.status as AcademicStatus,

          }),

        },

      });

    } catch (error) {

      this.handleUniqueConstraint(error);

      throw error;

    }

  }



  public async toggleStatus(id: string, actor: AuthUserPayload): Promise<Course> {

    this.assertCanMutate(actor);

    const existing = await this.getById(id, actor);



    return prisma.course.update({

      where: { id },

      data: {

        status:

          existing.status === AcademicStatus.ACTIVE

            ? AcademicStatus.INACTIVE

            : AcademicStatus.ACTIVE,

      },

    });

  }



  public async remove(id: string, actor: AuthUserPayload): Promise<void> {

    this.assertCanMutate(actor);

    const existing = await this.getById(id, actor);



    const semesterCount = await prisma.semester.count({

      where: { courseId: existing.id },

    });



    if (semesterCount > 0) {

      throw new AppError(

        'Cannot delete course with linked semesters. Remove semesters first.',

        409

      );

    }



    await prisma.course.delete({ where: { id } });

  }



  private buildListWhere(

    query: CourseQueryInput,

    actor: AuthUserPayload

  ): Prisma.CourseWhereInput {

    const where: Prisma.CourseWhereInput = {};

    const collegeId = this.resolveReadCollegeId(actor, query.collegeId);

    if (collegeId) {

      where.collegeId = collegeId;

    }



    if (query.departmentId) {

      where.departmentId = query.departmentId;

    }



    if (query.status) {

      where.status = query.status as AcademicStatus;

    }



    if (query.courseType) {

      where.courseType = query.courseType as CourseType;

    }



    if (query.search) {

      where.OR = [

        { name: { contains: query.search, mode: 'insensitive' } },

        { code: { contains: query.search, mode: 'insensitive' } },

        { description: { contains: query.search, mode: 'insensitive' } },

      ];

    }



    return where;

  }



  private async getAccessibleDepartment(departmentId: string, actor: AuthUserPayload) {

    const department = await prisma.department.findUnique({

      where: { id: departmentId },

    });



    if (!department) {

      throw new AppError('Department not found', 404);

    }



    this.assertCanAccessCollege(actor, department.collegeId);

    return department;

  }



  private resolveReadCollegeId(

    actor: AuthUserPayload,

    requestedCollegeId?: string

  ): string | undefined {

    if (actor.role === AppRole.SUPER_ADMIN) {

      return requestedCollegeId;

    }



    if (!actor.collegeId) {

      throw new AppError('Your account is not linked to a college', 403);

    }



    if (requestedCollegeId && requestedCollegeId !== actor.collegeId) {

      throw new AppError('Cross-college access is not allowed', 403);

    }



    return actor.collegeId;

  }



  private assertCanAccessCollege(actor: AuthUserPayload, collegeId: string): void {

    if (actor.role === AppRole.SUPER_ADMIN) return;



    if (!actor.collegeId || actor.collegeId !== collegeId) {

      throw new AppError('Cross-college access is not allowed', 403);

    }

  }



  private assertCanMutate(actor: AuthUserPayload): void {

    if (actor.role === AppRole.SUPER_ADMIN || actor.role === AppRole.COLLEGE_ADMIN) {

      return;

    }

    throw new AppError('You do not have permission to modify this resource', 403);

  }



  private async assertUniqueCode(

    collegeId: string,

    code: string,

    excludeId?: string

  ): Promise<void> {

    const existing = await prisma.course.findFirst({

      where: {

        collegeId,

        code,

        ...(excludeId ? { id: { not: excludeId } } : {}),

      },

    });



    if (existing) {

      throw new AppError('Course code already exists in this college', 409);

    }

  }



  private handleUniqueConstraint(error: unknown): void {

    if (

      error instanceof Prisma.PrismaClientKnownRequestError &&

      error.code === 'P2002'

    ) {

      throw new AppError('Course code already exists in this college', 409);

    }

  }

}



export const courseService = new CourseService();

