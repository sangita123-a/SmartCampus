import { CollegeStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { passwordService } from '../utils/password';
import { tokenService, JwtPayload } from '../utils/jwt';
import { hashToken, generateResetToken } from '../utils/crypto';
import { toSafeUser, toPrismaRole } from '../utils/userMapper';
import { Role } from '../types/roles';
import { SafeUser } from '../types/express';
import {
  assertPublicRegisterRole,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from '../validators/auth.validator';

export interface AuthResult {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  public async register(payload: RegisterInput): Promise<AuthResult> {
    const email = payload.email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('Email is already registered', 409);
    }

    const userCount = await prisma.user.count();
    let role: Role;

    if (userCount === 0) {
      role = Role.SUPER_ADMIN;
    } else {
      try {
        role = assertPublicRegisterRole(payload.role);
      } catch (error) {
        throw new AppError(
          error instanceof Error ? error.message : 'Invalid registration role',
          400
        );
      }
    }

    const hashedPassword = await passwordService.hash(payload.password);

    let collegeId: string | null = payload.collegeId ?? null;
    if (role !== Role.SUPER_ADMIN) {
      if (collegeId) {
        const college = await prisma.college.findUnique({ where: { id: collegeId } });
        if (!college || college.status === CollegeStatus.INACTIVE) {
          throw new AppError('Invalid or inactive college', 400);
        }
      }
    } else {
      collegeId = null;
    }

    const user = await prisma.user.create({
      data: {
        name: payload.name.trim(),
        email,
        password: hashedPassword,
        role: toPrismaRole(role),
        collegeId,
        isVerified: userCount === 0,
      },
    });

    return this.issueTokens(user.id);
  }

  public async login(payload: LoginInput): Promise<AuthResult> {
    const email = payload.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated. Contact your administrator.', 403);
    }

    const isValid = await passwordService.compare(payload.password, user.password);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return this.issueTokens(user.id);
  }

  public async refreshToken(rawRefreshToken: string): Promise<AuthResult> {
    if (!rawRefreshToken) {
      throw new AppError('Refresh token is required', 401);
    }

    let payload: JwtPayload;
    try {
      payload = tokenService.verifyRefreshToken(rawRefreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const tokenHash = hashToken(rawRefreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    if (!user.refreshToken || user.refreshToken !== tokenHash) {
      throw new AppError('Refresh token has been revoked', 401);
    }

    return this.issueTokens(user.id);
  }

  public async logout(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  public async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 404);
    }

    return toSafeUser(user);
  }

  public async forgotPassword(
    payload: ForgotPasswordInput
  ): Promise<{ message: string; resetToken?: string }> {
    const email = payload.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to avoid email enumeration
    if (!user) {
      return { message: 'If that email exists, a reset link has been sent' };
    }

    const resetToken = generateResetToken();
    const hashed = hashToken(resetToken);
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashed,
        passwordResetExpires: expires,
      },
    });

    // Email provider not configured yet — expose token in non-production for testing
    if (process.env.NODE_ENV === 'production') {
      return { message: 'If that email exists, a reset link has been sent' };
    }

    return {
      message: 'If that email exists, a reset link has been sent',
      resetToken,
    };
  }

  public async resetPassword(payload: ResetPasswordInput): Promise<void> {
    const hashed = hashToken(payload.token);

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashed,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const password = await passwordService.hash(payload.password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password,
        passwordResetToken: null,
        passwordResetExpires: null,
        refreshToken: null,
      },
    });
  }

  private async issueTokens(userId: string): Promise<AuthResult> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as Role,
      collegeId: user.collegeId,
    };

    const accessToken = tokenService.signAccessToken(jwtPayload);
    const refreshToken = tokenService.signRefreshToken(jwtPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashToken(refreshToken) },
    });

    return {
      user: toSafeUser(user),
      accessToken,
      refreshToken,
    };
  }
}

export const authService = new AuthService();
