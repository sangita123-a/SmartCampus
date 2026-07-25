import {

  AcademicStatus,

  Department,

  Prisma,

} from '@prisma/client';

import { prisma } from '../config/database';

import { AppError } from '../utils/AppError';

import { AuthUserPayload } from '../types/express';

import { Role as AppRole } from '../types/roles';

import {

  CreateDepartmentInput,

  DepartmentQueryInput,

  UpdateDepartmentInput,

} from '../validators/department.validator';



export type DepartmentWithCounts = Department & {

  _count: { courses: number };

};



export interface PaginatedDepartments {

  items: DepartmentWithCounts[];

  meta: {

    page: number;

    limit: number;

    total: number;

    totalPages: number;

  };

}



export class DepartmentService {

  public async create(

    payload: CreateDepartmentInput,

    actor: AuthUserPayload

  ): Promise<Department> {

    const collegeId = this.resolveWriteCollegeId(actor, payload.collegeId);

    await this.assertCollegeExists(collegeId);

    await this.assertUniqueFields(collegeId, payload);



    try {

      return await prisma.department.create({

        data: {

          collegeId,

          name: payload.name,

          code: payload.code,

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

    query: DepartmentQueryInput,

    actor: AuthUserPayload

  ): Promise<PaginatedDepartments> {

    const where = this.buildListWhere(query, actor);



    const [total, items] = await Promise.all([

      prisma.department.count({ where }),

      prisma.department.findMany({

        where,

        include: { _count: { select: { courses: true } } },

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



  public async getById(id: string, actor: AuthUserPayload): Promise<DepartmentWithCounts> {

    const department = await prisma.department.findUnique({

      where: { id },

      include: { _count: { select: { courses: true } } },

    });



    if (!department) {

      throw new AppError('Department not found', 404);

    }



    this.assertCanAccessCollege(actor, department.collegeId);

    return department;

  }



  public async update(

    id: string,

    payload: UpdateDepartmentInput,

    actor: AuthUserPayload

  ): Promise<Department> {

    this.assertCanMutate(actor);

    const existing = await this.getById(id, actor);

    await this.assertUniqueFields(existing.collegeId, payload, existing.id);



    try {

      return await prisma.department.update({

        where: { id },

        data: {

          ...(payload.name !== undefined && { name: payload.name }),

          ...(payload.code !== undefined && { code: payload.code }),

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



  public async toggleStatus(id: string, actor: AuthUserPayload): Promise<Department> {

    this.assertCanMutate(actor);

    const existing = await this.getById(id, actor);



    return prisma.department.update({

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



    const courseCount = await prisma.course.count({

      where: { departmentId: existing.id },

    });



    if (courseCount > 0) {

      throw new AppError(

        'Cannot delete department with linked courses. Remove or reassign courses first.',

        409

      );

    }



    await prisma.department.delete({ where: { id } });

  }



  private buildListWhere(

    query: DepartmentQueryInput,

    actor: AuthUserPayload

  ): Prisma.DepartmentWhereInput {

    const where: Prisma.DepartmentWhereInput = {};

    const collegeId = this.resolveReadCollegeId(actor, query.collegeId);

    if (collegeId) {

      where.collegeId = collegeId;

    }



    if (query.status) {

      where.status = query.status as AcademicStatus;

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



  private resolveWriteCollegeId(

    actor: AuthUserPayload,

    requestedCollegeId?: string

  ): string {

    if (actor.role === AppRole.SUPER_ADMIN) {

      if (!requestedCollegeId) {

        throw new AppError('collegeId is required for Super Admin', 400);

      }

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



  private async assertCollegeExists(collegeId: string): Promise<void> {

    const college = await prisma.college.findUnique({ where: { id: collegeId } });

    if (!college) {

      throw new AppError('College not found', 404);

    }

  }



  private async assertUniqueFields(

    collegeId: string,

    payload: Partial<CreateDepartmentInput>,

    excludeId?: string

  ): Promise<void> {

    if (payload.name) {

      const existingName = await prisma.department.findFirst({

        where: {

          collegeId,

          name: { equals: payload.name, mode: 'insensitive' },

          ...(excludeId ? { id: { not: excludeId } } : {}),

        },

      });

      if (existingName) {

        throw new AppError('Department name already exists in this college', 409);

      }

    }



    if (payload.code) {

      const existingCode = await prisma.department.findFirst({

        where: {

          collegeId,

          code: payload.code,

          ...(excludeId ? { id: { not: excludeId } } : {}),

        },

      });

      if (existingCode) {

        throw new AppError('Department code already exists in this college', 409);

      }

    }

  }



  private handleUniqueConstraint(error: unknown): void {

    if (

      error instanceof Prisma.PrismaClientKnownRequestError &&

      error.code === 'P2002'

    ) {

      const target = (error.meta?.target as string[] | undefined) ?? [];

      if (target.includes('name')) {

        throw new AppError('Department name already exists in this college', 409);

      }

      if (target.includes('code')) {

        throw new AppError('Department code already exists in this college', 409);

      }

      throw new AppError('Department already exists', 409);

    }

  }

}



export const departmentService = new DepartmentService();

