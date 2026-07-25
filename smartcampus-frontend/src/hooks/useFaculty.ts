'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { facultyService } from '@/services/faculty.service';
import type { FacultyListParams, FacultyPayload, FacultyStatus } from '@/types';

export const facultyKeys = {
  all: ['faculty'] as const,
  lists: () => [...facultyKeys.all, 'list'] as const,
  list: (params: FacultyListParams) => [...facultyKeys.lists(), params] as const,
  details: () => [...facultyKeys.all, 'detail'] as const,
  detail: (id: string) => [...facultyKeys.details(), id] as const,
  dashboard: () => [...facultyKeys.all, 'dashboard'] as const,
};

export function useFacultyDashboard() {
  return useQuery({
    queryKey: facultyKeys.dashboard(),
    queryFn: async () => {
      const response = await facultyService.getDashboardStats();
      if (!response.data?.stats) throw new Error('Failed to load faculty stats');
      return response.data.stats;
    },
  });
}

export function useFacultyList(params: FacultyListParams, enabled = true) {
  return useQuery({
    queryKey: facultyKeys.list(params),
    queryFn: async () => {
      const response = await facultyService.list(params);
      if (!response.data) throw new Error('Failed to load faculty');
      return response.data;
    },
    enabled,
  });
}

export function useFaculty(id: string, enabled = true) {
  return useQuery({
    queryKey: facultyKeys.detail(id),
    queryFn: async () => {
      const response = await facultyService.getById(id);
      if (!response.data?.faculty) throw new Error('Faculty not found');
      return response.data.faculty;
    },
    enabled: Boolean(id) && enabled,
  });
}

export function useCreateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FacultyPayload) => facultyService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: facultyKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
    },
  });
}

export function useUpdateFaculty(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<FacultyPayload>) => facultyService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: facultyKeys.all });
    },
  });
}

export function useDeleteFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => facultyService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: facultyKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
    },
  });
}

export function useBulkDeleteFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => facultyService.bulkDelete(ids),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: facultyKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
    },
  });
}

export function useBulkFacultyStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: FacultyStatus }) =>
      facultyService.bulkStatus(ids, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: facultyKeys.all });
    },
  });
}

export function useUploadFacultyImage() {
  return useMutation({
    mutationFn: (file: File) => facultyService.uploadImage(file),
  });
}

export function useImportFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => facultyService.importFile(file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: facultyKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
    },
  });
}
