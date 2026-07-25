'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { getDashboardPath } from '@/types/roles';
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '@/types';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

export function useLoginMutation() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async (response) => {
      if (!response.data) return;
      const { user, accessToken } = response.data;
      setAuth(user, accessToken);
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
      router.replace(getDashboardPath(user.role));
    },
  });
}

export function useRegisterMutation() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: async (response) => {
      if (!response.data) return;
      const { user, accessToken } = response.data;
      setAuth(user, accessToken);
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
      router.replace(getDashboardPath(user.role));
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authService.forgotPassword(payload),
  });
}

export function useResetPasswordMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authService.resetPassword(payload),
    onSuccess: () => {
      router.replace('/login');
    },
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      router.replace('/login');
    },
  });
}

export function useCurrentUser(enabled = true) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const response = await authService.me();
      if (response.data?.user) {
        setUser(response.data.user);
        return response.data.user;
      }
      throw new Error('Unable to load user profile');
    },
    enabled: enabled && Boolean(accessToken),
    retry: false,
    staleTime: 60_000,
    meta: {
      onAuthError: clearAuth,
    },
  });
}
