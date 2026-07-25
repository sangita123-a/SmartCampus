'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collegeService } from '@/services/college.service';
import type { CollegeListParams, CollegePayload } from '@/types';

export const collegeKeys = {
  all: ['colleges'] as const,
  lists: () => [...collegeKeys.all, 'list'] as const,
  list: (params: CollegeListParams) => [...collegeKeys.lists(), params] as const,
  details: () => [...collegeKeys.all, 'detail'] as const,
  detail: (id: string) => [...collegeKeys.details(), id] as const,
  dashboard: () => [...collegeKeys.all, 'dashboard'] as const,
};

export function useColleges(params: CollegeListParams) {
  return useQuery({
    queryKey: collegeKeys.list(params),
    queryFn: async () => {
      const response = await collegeService.list(params);
      if (!response.data) throw new Error('Failed to load colleges');
      return response.data;
    },
  });
}

export function useCollege(id: string, enabled = true) {
  return useQuery({
    queryKey: collegeKeys.detail(id),
    queryFn: async () => {
      const response = await collegeService.getById(id);
      if (!response.data?.college) throw new Error('College not found');
      return response.data.college;
    },
    enabled: Boolean(id) && enabled,
  });
}

export function useSuperAdminDashboard() {
  return useQuery({
    queryKey: collegeKeys.dashboard(),
    queryFn: async () => {
      const response = await collegeService.getDashboardStats();
      if (!response.data?.stats) throw new Error('Failed to load dashboard stats');
      return response.data.stats;
    },
  });
}

export function useCreateCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CollegePayload) => collegeService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: collegeKeys.all });
    },
  });
}

export function useUpdateCollege(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CollegePayload>) => collegeService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: collegeKeys.all });
    },
  });
}

export function useDeactivateCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => collegeService.deactivate(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: collegeKeys.all });
    },
  });
}

export function useReactivateCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => collegeService.reactivate(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: collegeKeys.all });
    },
  });
}

export function useDeleteCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => collegeService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: collegeKeys.all });
    },
  });
}
