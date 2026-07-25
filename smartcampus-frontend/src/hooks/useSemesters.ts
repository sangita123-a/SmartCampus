'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { semesterService } from '@/services/semester.service';
import type { SemesterListParams, SemesterPayload } from '@/types';

export const semesterKeys = {
  all: ['semesters'] as const,
  lists: () => [...semesterKeys.all, 'list'] as const,
  list: (params: SemesterListParams) => [...semesterKeys.lists(), params] as const,
  details: () => [...semesterKeys.all, 'detail'] as const,
  detail: (id: string) => [...semesterKeys.details(), id] as const,
};

export function useSemesters(params: SemesterListParams, enabled = true) {
  return useQuery({
    queryKey: semesterKeys.list(params),
    queryFn: async () => {
      const response = await semesterService.list(params);
      if (!response.data) throw new Error('Failed to load semesters');
      return response.data;
    },
    enabled,
  });
}

export function useSemester(id: string, enabled = true) {
  return useQuery({
    queryKey: semesterKeys.detail(id),
    queryFn: async () => {
      const response = await semesterService.getById(id);
      if (!response.data?.semester) throw new Error('Semester not found');
      return response.data.semester;
    },
    enabled: Boolean(id) && enabled,
  });
}

export function useCreateSemester() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SemesterPayload) => semesterService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: semesterKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateSemester(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SemesterPayload>) =>
      semesterService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: semesterKeys.all });
    },
  });
}

export function useToggleSemesterStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => semesterService.toggleStatus(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: semesterKeys.all });
    },
  });
}

export function useDeleteSemester() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => semesterService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: semesterKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}
