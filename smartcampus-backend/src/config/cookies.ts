import { CookieOptions } from 'express';
import { env } from './env';

export const REFRESH_TOKEN_COOKIE = 'refreshToken';

const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE || env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: REFRESH_MAX_AGE_MS,
  path: '/api/v1/auth',
};
