import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { classroomApi } from '@/services/classroom.service';
import { Classroom } from '@/types/classroom';

export function useClassroomList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['classrooms', params],
    queryFn: () => classroomApi.list(params),
  });
}

export function useClassroomDetails(id: string) {
  return useQuery({
    queryKey: ['classrooms', id],
    queryFn: () => classroomApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Classroom>) => classroomApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });
}

export function useUpdateClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Classroom> }) => classroomApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });
}

export function useDeleteClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => classroomApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });
}
