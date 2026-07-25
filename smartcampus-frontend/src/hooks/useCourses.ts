'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/services/course.service';
import type { CourseListParams, CoursePayload } from '@/types';

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (params: CourseListParams) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

export function useCourses(params: CourseListParams, enabled = true) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: async () => {
      const response = await courseService.list(params);
      if (!response.data) throw new Error('Failed to load courses');
      return response.data;
    },
    enabled,
  });
}

export function useCourse(id: string, enabled = true) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: async () => {
      const response = await courseService.getById(id);
      if (!response.data?.course) throw new Error('Course not found');
      return response.data.course;
    },
    enabled: Boolean(id) && enabled,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CoursePayload) => courseService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: courseKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useUpdateCourse(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CoursePayload>) => courseService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}

export function useToggleCourseStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseService.toggleStatus(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: courseKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['college-admin'] });
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}
