'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studentService } from '@/services/student.service';
import type { StudentListParams, StudentPayload, StudentStatus } from '@/types';

export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (params: StudentListParams) => [...studentKeys.lists(), params] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
  dashboard: () => [...studentKeys.all, 'dashboard'] as const,
};

export function useStudentDashboard() {
  return useQuery({
    queryKey: studentKeys.dashboard(),
    queryFn: async () => {
      const response = await studentService.getDashboardStats();
      if (!response.data?.stats) throw new Error('Failed to load student stats');
      return response.data.stats;
    },
  });
}

export function useStudents(params: StudentListParams) {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: async () => {
      const response = await studentService.list(params);
      if (!response.data) throw new Error('Failed to load students');
      return response.data;
    },
  });
}

export function useStudent(id: string, enabled = true) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: async () => {
      const response = await studentService.getById(id);
      if (!response.data?.student) throw new Error('Student not found');
      return response.data.student;
    },
    enabled: Boolean(id) && enabled,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StudentPayload) => studentService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studentKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
    },
  });
}

export function useUpdateStudent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<StudentPayload>) => studentService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studentKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
    },
  });
}

export function useBulkDeleteStudents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => studentService.bulkDelete(ids),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studentKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
    },
  });
}

export function useBulkStudentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: StudentStatus }) =>
      studentService.bulkStatus(ids, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useUploadStudentImage() {
  return useMutation({
    mutationFn: (file: File) => studentService.uploadImage(file),
  });
}

export function useImportStudents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => studentService.importFile(file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studentKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
    },
  });
}
