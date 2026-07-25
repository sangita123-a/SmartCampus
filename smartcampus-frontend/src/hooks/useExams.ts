import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { examApi } from '@/services/exam.service';
import { ExamRecord, ExamSubject } from '@/types/exam';

export function useExams(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['exams', params],
    queryFn: () => examApi.list(params),
  });
}

export function useExamDetails(id: string) {
  return useQuery({
    queryKey: ['exams', id],
    queryFn: () => examApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ExamRecord>) => examApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExamRecord> }) => examApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => examApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

export function useAddExamSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ExamSubject>) => examApi.addExamSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

export function useRemoveExamSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => examApi.removeExamSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

export function useBulkSaveMarks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { examId: string; subjectId: string; marks: { studentId: string; obtainedMarks: number; resultStatus?: string; remarks?: string }[] }) =>
      examApi.bulkSaveMarks(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

export function usePublishResults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (examId: string) => examApi.publishResults(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

export function useUnpublishResults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (examId: string) => examApi.unpublishResults(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

export function useStudentMarksheet(studentId?: string, examId?: string) {
  return useQuery({
    queryKey: ['exams', 'marksheet', studentId, examId],
    queryFn: () => examApi.getStudentMarksheet(studentId!, examId!),
    enabled: Boolean(studentId && examId),
  });
}

export function useRankList(examId?: string) {
  return useQuery({
    queryKey: ['exams', 'rank-list', examId],
    queryFn: () => examApi.getRankList(examId!),
    enabled: Boolean(examId),
  });
}

export function useHallTicket(studentId?: string, examId?: string) {
  return useQuery({
    queryKey: ['exams', 'hall-ticket', studentId, examId],
    queryFn: () => examApi.getHallTicket(studentId!, examId!),
    enabled: Boolean(studentId && examId),
  });
}

export function useExamDashboard() {
  return useQuery({
    queryKey: ['exams', 'dashboard'],
    queryFn: () => examApi.getDashboardCards(),
  });
}
