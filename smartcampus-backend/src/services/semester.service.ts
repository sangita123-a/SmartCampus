import { AcademicStatus, Prisma, Semester } from '@prisma/client';

import { prisma } from '../config/database';

import { AppError } from '../utils/AppError';

import { AuthUserPayload } from '../types/express';

import { Role as AppRole } from '../types/roles';

import {

  CreateSemesterInput,

  SemesterQueryInput,

  UpdateSemesterInput,

} from '../validators/semester.validator';



export type SemesterWithRelations = Semester & {

  course: {

    id: string;

    name: string;

    code: string;

    collegeId: string;

    department: { id: string; name: string; code: string };

  };

};



export interface PaginatedSemesters {

  items: SemesterWithRelations[];

  meta: {

    page: number;

    limit: number;

    total: number;

    totalPages: number;

  };

}



export class SemesterService {

  public async create(

    payload: CreateSemesterInput,

    actor: AuthUserPayload

  ): Promise<Semester> {

    const course = await this.getAccessibleCourse(payload.courseId, actor);

    await this.assertUniqueSemesterNumber(course.id, payload.semesterNumber);



    try {

      return await prisma.semester.create({

        data: {

          courseId: course.id,

          semesterNumber: payload.semesterNumber,

          name: payload.name,

          startDate: payload.startDate,

          endDate: payload.endDate,

          status: (payload.status as AcademicStatus | undefined) ?? AcademicStatus.ACTIVE,

        },

      });

    } catch (error) {

      this.handleUniqueConstraint(error);

      throw error;

    }

  }



  public async list(

    query: SemesterQueryInput,

    actor: AuthUserPayload

  ): Promise<PaginatedSemesters> {

    const where = this.buildListWhere(query, actor);



    const [total, items] = await Promise.all([

      prisma.semester.count({ where }),

      prisma.semester.findMany({

        where,

        include: {

          course: {

            select: {

              id: true,

              name: true,

              code: true,

              collegeId: true,

              department: { select: { id: true, name: true, code: true } },

            },

          },

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



  public async getById(id: string, actor: AuthUserPayload): Promise<SemesterWithRelations> {

    const semester = await prisma.semester.findUnique({

      where: { id },

      include: {

        course: {

          select: {

            id: true,

            name: true,

            code: true,

            collegeId: true,

            department: { select: { id: true, name: true, code: true } },

          },

        },

      },

    });



    if (!semester) {

      throw new AppError('Semester not found', 404);

    }



    this.assertCanAccessCollege(actor, semester.course.collegeId);

    return semester;

  }



  public async update(

    id: string,

    payload: UpdateSemesterInput,

    actor: AuthUserPayload

  ): Promise<Semester> {

    this.assertCanMutate(actor);

    const existing = await this.getById(id, actor);



    let courseId = existing.courseId;

    if (payload.courseId && payload.courseId !== existing.courseId) {

      const course = await this.getAccessibleCourse(payload.courseId, actor);

      if (course.collegeId !== existing.course.collegeId) {

        throw new AppError('Cannot move semester to a course in another college', 403);

      }

      courseId = course.id;

    }



    const semesterNumber = payload.semesterNumber ?? existing.semesterNumber;

    if (

      payload.semesterNumber !== undefined ||

      (payload.courseId && payload.courseId !== existing.courseId)

    ) {

      await this.assertUniqueSemesterNumber(courseId, semesterNumber, existing.id);

    }



    const startDate = payload.startDate ?? existing.startDate;

    const endDate = payload.endDate ?? existing.endDate;

    if (endDate <= startDate) {

      throw new AppError('End date must be after start date', 400);

    }



    try {

      return await prisma.semester.update({

        where: { id },

        data: {

          courseId,

          ...(payload.semesterNumber !== undefined && {

            semesterNumber: payload.semesterNumber,

          }),

          ...(payload.name !== undefined && { name: payload.name }),

          ...(payload.startDate !== undefined && { startDate: payload.startDate }),

          ...(payload.endDate !== undefined && { endDate: payload.endDate }),

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



  public async toggleStatus(id: string, actor: AuthUserPayload): Promise<Semester> {

    this.assertCanMutate(actor);

    const existing = await this.getById(id, actor);



    return prisma.semester.update({

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

    await this.getById(id, actor);

    await prisma.semester.delete({ where: { id } });

  }



  private buildListWhere(

    query: SemesterQueryInput,

    actor: AuthUserPayload

  ): Prisma.SemesterWhereInput {

    const where: Prisma.SemesterWhereInput = {};



    if (query.courseId) {

      where.courseId = query.courseId;

    }



    if (query.status) {

      where.status = query.status as AcademicStatus;

    }



    if (query.search) {

      where.OR = [

        { name: { contains: query.search, mode: 'insensitive' } },

      ];

    }



    const collegeId = this.resolveReadCollegeId(actor, query.collegeId);

    if (collegeId) {

      where.course = { collegeId };

    }



    return where;

  }



  private async getAccessibleCourse(courseId: string, actor: AuthUserPayload) {

    const course = await prisma.course.findUnique({ where: { id: courseId } });



    if (!course) {

      throw new AppError('Course not found', 404);

    }



    this.assertCanAccessCollege(actor, course.collegeId);

    return course;

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



  private async assertUniqueSemesterNumber(

    courseId: string,

    semesterNumber: number,

    excludeId?: string

  ): Promise<void> {

    const existing = await prisma.semester.findFirst({

      where: {

        courseId,

        semesterNumber,

        ...(excludeId ? { id: { not: excludeId } } : {}),

      },

    });



    if (existing) {

      throw new AppError('Semester number already exists for this course', 409);

    }

  }



  private handleUniqueConstraint(error: unknown): void {

    if (

      error instanceof Prisma.PrismaClientKnownRequestError &&

      error.code === 'P2002'

    ) {

      throw new AppError('Semester number already exists for this course', 409);

    }

  }

}



export const semesterService = new SemesterService();

