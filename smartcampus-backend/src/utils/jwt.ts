import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { Role } from '../types/roles';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  collegeId: string | null;
}

export const tokenService = {
  signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, jwtConfig.accessSecret, {
      expiresIn: jwtConfig.accessExpiresIn as jwt.SignOptions['expiresIn'],
    });
  },

  signRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpiresIn as jwt.SignOptions['expiresIn'],
    });
  },

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, jwtConfig.accessSecret) as JwtPayload;
  },

  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, jwtConfig.refreshSecret) as JwtPayload;
  },
};
