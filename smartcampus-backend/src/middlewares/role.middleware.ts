import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { AuthenticatedRequest } from '../types/express';
import { Role } from '../types/roles';

/**
 * Restricts access to the given roles.
 * SUPER_ADMIN always bypasses role checks.
 */
export const authorize =
  (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      next(new AppError('Authentication required', 401));
      return;
    }

    if (authReq.user.role === Role.SUPER_ADMIN) {
      next();
      return;
    }

    if (!allowedRoles.includes(authReq.user.role)) {
      next(new AppError('You do not have permission to access this resource', 403));
      return;
    }

    next();
  };

/**
 * Ensures College Admin (and scoped roles) can only act within their college.
 * SUPER_ADMIN bypasses college scope.
 */
export const requireCollegeScope =
  (collegeIdParam: string = 'collegeId') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      next(new AppError('Authentication required', 401));
      return;
    }

    if (authReq.user.role === Role.SUPER_ADMIN) {
      next();
      return;
    }

    const targetCollegeId =
      (req.params[collegeIdParam] as string | undefined) ||
      (req.body?.collegeId as string | undefined) ||
      (req.query[collegeIdParam] as string | undefined);

    if (authReq.user.role === Role.COLLEGE_ADMIN || 
        authReq.user.role === Role.FACULTY ||
        authReq.user.role === Role.STUDENT ||
        authReq.user.role === Role.PARENT ||
        authReq.user.role === Role.LIBRARIAN ||
        authReq.user.role === Role.ACCOUNTANT) {
      if (!authReq.user.collegeId) {
        next(new AppError('Your account is not linked to a college', 403));
        return;
      }

      if (targetCollegeId && targetCollegeId !== authReq.user.collegeId) {
        next(new AppError('Access restricted to your college only', 403));
        return;
      }
    }

    next();
  };

/**
 * Ensures the authenticated user can only access their own resource (by :userId / :id).
 * SUPER_ADMIN and COLLEGE_ADMIN (same college) may bypass for admin operations later.
 */
export const requireSelf =
  (paramName: string = 'userId') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      next(new AppError('Authentication required', 401));
      return;
    }

    if (authReq.user.role === Role.SUPER_ADMIN) {
      next();
      return;
    }

    const targetId = req.params[paramName];

    if (targetId && targetId !== authReq.user.id) {
      next(new AppError('You can only access your own resources', 403));
      return;
    }

    next();
  };
