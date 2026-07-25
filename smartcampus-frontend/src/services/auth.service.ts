import { apiClient } from '@/lib/apiClient';
import type {
  ApiSuccessResponse,
  AuthResponseData,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from '@/types';

export const authService = {
  async login(payload: LoginPayload): Promise<ApiSuccessResponse<AuthResponseData>> {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
  },

  async register(
    payload: RegisterPayload
  ): Promise<ApiSuccessResponse<AuthResponseData>> {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },

  async refreshToken(): Promise<ApiSuccessResponse<AuthResponseData>> {
    const { data } = await apiClient.post('/auth/refresh-token', {});
    return data;
  },

  async logout(): Promise<ApiSuccessResponse> {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  },

  async me(): Promise<ApiSuccessResponse<{ user: User }>> {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<ApiSuccessResponse<{ resetToken?: string }>> {
    const { data } = await apiClient.post('/auth/forgot-password', payload);
    return data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<ApiSuccessResponse> {
    const { data } = await apiClient.post('/auth/reset-password', payload);
    return data;
  },
};
