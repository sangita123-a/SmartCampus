import { Role as PrismaRole, User } from '@prisma/client';
import { SafeUser } from '../types/express';
import { Role } from '../types/roles';

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    isActive: user.isActive,
    isVerified: user.isVerified,
    collegeId: user.collegeId,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toPrismaRole(role: Role): PrismaRole {
  return role as unknown as PrismaRole;
}
