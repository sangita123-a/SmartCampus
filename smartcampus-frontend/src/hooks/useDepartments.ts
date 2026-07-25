'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '@/services/department.service';
import type { DepartmentListParams, DepartmentPayload } from '@/types';

export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (params: DepartmentListParams) => [...departmentKeys.lists(), params] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
};

export function useDepartments(params: DepartmentListParams, enabled = true) {
  return useQuery({
    queryKey: departmentKeys.list(params),
    queryFn: async () => {
      const response = await departmentService.list(params);
      if (!response.data) throw new Error('Failed to load departments');
      return response.data;
    },
    enabled,
  });
}

export function useDepartment(id: string, enabled = true) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: async () => {
      const response = await departmentService.getById(id);
      if (!response.data?.department) throw new Error('Department not found');
      return response.data.department;
    },
    enabled: Boolean(id) && enabled,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepartmentPayload) => departmentService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
    },
  });
}

export function useUpdateDepartment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<DepartmentPayload>) =>
      departmentService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
}

export function useToggleDepartmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentService.toggleStatus(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
    },
  });
}
