'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '@/services/subject.service';
import type { AcademicStatus, SubjectListParams, SubjectPayload } from '@/types';

export const subjectKeys = {
  all: ['subjects'] as const,
  lists: () => [...subjectKeys.all, 'list'] as const,
  list: (params: SubjectListParams) => [...subjectKeys.lists(), params] as const,
  details: () => [...subjectKeys.all, 'detail'] as const,
  detail: (id: string) => [...subjectKeys.details(), id] as const,
  dashboard: () => [...subjectKeys.all, 'dashboard'] as const,
};

export function useSubjectDashboard() {
  return useQuery({
    queryKey: subjectKeys.dashboard(),
    queryFn: async () => {
      const response = await subjectService.getDashboardStats();
      if (!response.data?.stats) throw new Error('Failed to load subject stats');
      return response.data.stats;
    },
  });
}

export function useSubjects(params: SubjectListParams) {
  return useQuery({
    queryKey: subjectKeys.list(params),
    queryFn: async () => {
      const response = await subjectService.list(params);
      if (!response.data) throw new Error('Failed to load subjects');
      return response.data;
    },
  });
}

export function useSubject(id: string, enabled = true) {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: async () => {
      const response = await subjectService.getById(id);
      if (!response.data?.subject) throw new Error('Subject not found');
      return response.data.subject;
    },
    enabled: Boolean(id) && enabled,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubjectPayload) => subjectService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

export function useUpdateSubject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SubjectPayload>) => subjectService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

export function useAssignFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, facultyId }: { id: string; facultyId: string }) =>
      subjectService.assignFaculty(id, facultyId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

export function useRemoveSubjectFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subjectService.removeFaculty(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subjectService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

export function useBulkDeleteSubjects() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => subjectService.bulkDelete(ids),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

export function useBulkSubjectStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: AcademicStatus }) =>
      subjectService.bulkStatus(ids, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}
