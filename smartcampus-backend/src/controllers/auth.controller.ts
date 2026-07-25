import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { REFRESH_TOKEN_COOKIE, refreshCookieOptions } from '../config/cookies';
import { AuthenticatedRequest } from '../types/express';
import { AppError } from '../utils/AppError';

function setRefreshCookie(res: Response, refreshToken: string): void {
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshCookieOptions);
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: refreshCookieOptions.httpOnly,
    secure: refreshCookieOptions.secure,
    sameSite: refreshCookieOptions.sameSite,
    path: refreshCookieOptions.path,
  });
}

function extractRefreshToken(req: Request): string | undefined {
  const fromCookie = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;
  const fromBody = (req.body as { refreshToken?: string } | undefined)?.refreshToken;
  return fromCookie || fromBody;
}

export class AuthController {
  public register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    setRefreshCookie(res, result.refreshToken);

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Registration successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    setRefreshCookie(res, result.refreshToken);

    return sendSuccess({
      res,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  });

  public refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const rawToken = extractRefreshToken(req);
    if (!rawToken) {
      throw new AppError('Refresh token is required', 401);
    }

    const result = await authService.refreshToken(rawToken);
    setRefreshCookie(res, result.refreshToken);

    return sendSuccess({
      res,
      message: 'Token refreshed successfully',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  });

  public logout = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (authReq.user?.id) {
      await authService.logout(authReq.user.id);
    }

    clearRefreshCookie(res);

    return sendSuccess({
      res,
      message: 'Logout successful',
    });
  });

  public me = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await authService.getCurrentUser(authReq.user.id);

    return sendSuccess({
      res,
      message: 'Current user fetched successfully',
      data: { user },
    });
  });

  public forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.forgotPassword(req.body);

    return sendSuccess({
      res,
      message: result.message,
      data: result.resetToken ? { resetToken: result.resetToken } : undefined,
    });
  });

  public resetPassword = asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body);
    clearRefreshCookie(res);

    return sendSuccess({
      res,
      message: 'Password reset successful. Please log in with your new password.',
    });
  });
}

export const authController = new AuthController();
