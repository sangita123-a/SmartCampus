import {
  College,
  CollegeStatus,
  Prisma,
  Role,
  SubscriptionPlan,
} from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import {
  CollegeQueryInput,
  CreateCollegeInput,
  UpdateCollegeInput,
} from '../validators/college.validator';
import { AuthUserPayload } from '../types/express';
import { Role as AppRole } from '../types/roles';

export interface PaginatedColleges {
  items: College[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SuperAdminDashboardStats {
  totalColleges: number;
  totalStudents: number;
  totalFaculty: number;
  totalUsers: number;
  activeColleges: number;
  expiredPlans: number;
  recentRegistrations: Array<{
    id: string;
    name: string;
    code: string;
    email: string;
    status: CollegeStatus;
    subscriptionPlan: SubscriptionPlan;
    createdAt: Date;
  }>;
}

export class CollegeService {
  public async create(payload: CreateCollegeInput): Promise<College> {
    await this.assertUniqueFields(payload);

    try {
      return await prisma.college.create({
        data: {
          name: payload.name,
          code: payload.code,
          email: payload.email,
          phone: payload.phone ?? null,
          address: payload.address ?? null,
          website: payload.website ?? null,
          logo: payload.logo ?? null,
          status: (payload.status as CollegeStatus | undefined) ?? CollegeStatus.ACTIVE,
          subscriptionPlan:
            (payload.subscriptionPlan as SubscriptionPlan | undefined) ??
            SubscriptionPlan.FREE,
          subscriptionStart: payload.subscriptionStart ?? new Date(),
          subscriptionEnd: payload.subscriptionEnd ?? null,
        },
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  public async list(
    query: CollegeQueryInput,
    actor: AuthUserPayload
  ): Promise<PaginatedColleges> {
    const where = this.buildListWhere(query, actor);

    const [total, items] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
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

  public async getById(id: string, actor: AuthUserPayload): Promise<College> {
    const college = await prisma.college.findUnique({ where: { id } });

    if (!college) {
      throw new AppError('College not found', 404);
    }

    this.assertCanAccessCollege(actor, college.id);
    return college;
  }

  public async update(
    id: string,
    payload: UpdateCollegeInput,
    actor: AuthUserPayload
  ): Promise<College> {
    const existing = await this.getById(id, actor);

    if (actor.role !== AppRole.SUPER_ADMIN) {
      throw new AppError('Only Super Admin can update college records', 403);
    }

    await this.assertUniqueFields(payload, existing.id);

    try {
      return await prisma.college.update({
        where: { id },
        data: {
          ...(payload.name !== undefined && { name: payload.name }),
          ...(payload.code !== undefined && { code: payload.code }),
          ...(payload.email !== undefined && { email: payload.email }),
          ...(payload.phone !== undefined && { phone: payload.phone }),
          ...(payload.address !== undefined && { address: payload.address }),
          ...(payload.website !== undefined && { website: payload.website }),
          ...(payload.logo !== undefined && { logo: payload.logo }),
          ...(payload.status !== undefined && {
            status: payload.status as CollegeStatus,
          }),
          ...(payload.subscriptionPlan !== undefined && {
            subscriptionPlan: payload.subscriptionPlan as SubscriptionPlan,
          }),
          ...(payload.subscriptionStart !== undefined && {
            subscriptionStart: payload.subscriptionStart,
          }),
          ...(payload.subscriptionEnd !== undefined && {
            subscriptionEnd: payload.subscriptionEnd,
          }),
        },
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  public async deactivate(id: string, actor: AuthUserPayload): Promise<College> {
    if (actor.role !== AppRole.SUPER_ADMIN) {
      throw new AppError('Only Super Admin can deactivate colleges', 403);
    }

    await this.getById(id, actor);

    return prisma.college.update({
      where: { id },
      data: { status: CollegeStatus.INACTIVE },
    });
  }

  public async reactivate(id: string, actor: AuthUserPayload): Promise<College> {
    if (actor.role !== AppRole.SUPER_ADMIN) {
      throw new AppError('Only Super Admin can reactivate colleges', 403);
    }

    await this.getById(id, actor);

    return prisma.college.update({
      where: { id },
      data: { status: CollegeStatus.ACTIVE },
    });
  }

  public async remove(id: string, actor: AuthUserPayload): Promise<void> {
    if (actor.role !== AppRole.SUPER_ADMIN) {
      throw new AppError('Only Super Admin can delete colleges', 403);
    }

    await this.getById(id, actor);

    const userCount = await prisma.user.count({ where: { collegeId: id } });
    if (userCount > 0) {
      // Soft-delete when users are linked to preserve tenant integrity
      await prisma.college.update({
        where: { id },
        data: { status: CollegeStatus.INACTIVE },
      });
      return;
    }

    await prisma.college.delete({ where: { id } });
  }

  public async getSuperAdminStats(): Promise<SuperAdminDashboardStats> {
    const now = new Date();

    const [
      totalColleges,
      activeColleges,
      expiredPlans,
      totalUsers,
      totalStudents,
      totalFaculty,
      recentRegistrations,
    ] = await Promise.all([
      prisma.college.count(),
      prisma.college.count({ where: { status: CollegeStatus.ACTIVE } }),
      prisma.college.count({
        where: {
          subscriptionEnd: { lt: now },
          status: { not: CollegeStatus.INACTIVE },
        },
      }),
      prisma.user.count({
        where: { role: { not: Role.SUPER_ADMIN } },
      }),
      prisma.user.count({ where: { role: Role.STUDENT } }),
      prisma.user.count({ where: { role: Role.FACULTY } }),
      prisma.college.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: {
          id: true,
          name: true,
          code: true,
          email: true,
          status: true,
          subscriptionPlan: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalColleges,
      totalStudents,
      totalFaculty,
      totalUsers,
      activeColleges,
      expiredPlans,
      recentRegistrations,
    };
  }

  private buildListWhere(
    query: CollegeQueryInput,
    actor: AuthUserPayload
  ): Prisma.CollegeWhereInput {
    const where: Prisma.CollegeWhereInput = {};

    if (actor.role !== AppRole.SUPER_ADMIN) {
      if (!actor.collegeId) {
        throw new AppError('Your account is not linked to a college', 403);
      }
      where.id = actor.collegeId;
    }

    if (query.status) {
      where.status = query.status as CollegeStatus;
    }

    if (query.subscriptionPlan) {
      where.subscriptionPlan = query.subscriptionPlan as SubscriptionPlan;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private assertCanAccessCollege(actor: AuthUserPayload, collegeId: string): void {
    if (actor.role === AppRole.SUPER_ADMIN) return;

    if (!actor.collegeId || actor.collegeId !== collegeId) {
      throw new AppError('Cross-college access is not allowed', 403);
    }
  }

  private async assertUniqueFields(
    payload: Partial<CreateCollegeInput>,
    excludeId?: string
  ): Promise<void> {
    const checks: Array<Promise<void>> = [];

    if (payload.name) {
      checks.push(
        this.assertUnique('name', payload.name, 'College name already exists', excludeId)
      );
    }
    if (payload.code) {
      checks.push(
        this.assertUnique('code', payload.code, 'College code already exists', excludeId)
      );
    }
    if (payload.email) {
      checks.push(
        this.assertUnique('email', payload.email, 'College email already exists', excludeId)
      );
    }

    await Promise.all(checks);
  }

  private async assertUnique(
    field: 'name' | 'code' | 'email',
    value: string,
    message: string,
    excludeId?: string
  ): Promise<void> {
    const existing = await prisma.college.findFirst({
      where: {
        [field]: value,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });

    if (existing) {
      throw new AppError(message, 409);
    }
  }

  private handleUniqueConstraint(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = (error.meta?.target as string[] | undefined)?.[0] ?? 'field';
      throw new AppError(`College ${target} already exists`, 409);
    }
  }
}

export const collegeService = new CollegeService();
