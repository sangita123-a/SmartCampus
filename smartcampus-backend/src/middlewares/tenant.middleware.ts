import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { AuthenticatedRequest } from '../types/express';
import { Role } from '../types/roles';

export interface TenantRequest extends AuthenticatedRequest {
  tenantId?: string | null;
}

/**
 * Attaches the authenticated user's college (tenant) to the request.
 * SUPER_ADMIN has no tenant restriction (tenantId remains null).
 * Other roles must belong to a college.
 */
export const attachTenant = (req: Request, _res: Response, next: NextFunction): void => {
  const authReq = req as TenantRequest;

  if (!authReq.user) {
    next(new AppError('Authentication required', 401));
    return;
  }

  if (authReq.user.role === Role.SUPER_ADMIN) {
    authReq.tenantId = null;
    next();
    return;
  }

  if (!authReq.user.collegeId) {
    next(new AppError('Your account is not linked to a college', 403));
    return;
  }

  authReq.tenantId = authReq.user.collegeId;
  next();
};

/**
 * Ensures the resource collegeId matches the caller's tenant.
 * SUPER_ADMIN bypasses this check.
 */
export const enforceTenantIsolation =
  (paramName: string = 'id') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const authReq = req as TenantRequest;

    if (!authReq.user) {
      next(new AppError('Authentication required', 401));
      return;
    }

    if (authReq.user.role === Role.SUPER_ADMIN) {
      next();
      return;
    }

    const resourceCollegeId =
      (req.params[paramName] as string | undefined) ||
      (req.body?.collegeId as string | undefined);

    if (!authReq.tenantId) {
      next(new AppError('Tenant context is missing', 403));
      return;
    }

    if (resourceCollegeId && resourceCollegeId !== authReq.tenantId) {
      next(new AppError('Cross-college access is not allowed', 403));
      return;
    }

    next();
  };
