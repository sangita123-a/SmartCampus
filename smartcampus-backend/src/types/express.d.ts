import { Request } from 'express';
import { Role } from './roles';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export interface AuthUserPayload {
  id: string;
  email: string;
  role: Role;
  collegeId: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  collegeId: string | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
