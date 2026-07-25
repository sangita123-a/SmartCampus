import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '@/services/attendance.service';
import { AttendanceRecord, BulkAttendancePayload } from '@/types/attendance';

export function useAttendanceList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['attendance', params],
    queryFn: () => attendanceApi.list(params),
  });
}

export function useAttendanceDetails(id: string) {
  return useQuery({
    queryKey: ['attendance', id],
    queryFn: () => attendanceApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useAttendanceDashboard() {
  return useQuery({
    queryKey: ['attendance', 'dashboard'],
    queryFn: () => attendanceApi.getDashboardCards(),
  });
}

export function useStudentAttendanceReport(studentId?: string) {
  return useQuery({
    queryKey: ['attendance', 'student-report', studentId],
    queryFn: () => attendanceApi.getStudentPercentageReport(studentId),
  });
}

export function useFacultyAttendanceSummary(facultyId?: string) {
  return useQuery({
    queryKey: ['attendance', 'faculty-summary', facultyId],
    queryFn: () => attendanceApi.getFacultySummaryReport(facultyId),
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AttendanceRecord>) => attendanceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useBulkMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BulkAttendancePayload) => attendanceApi.bulkMark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AttendanceRecord> }) => attendanceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => attendanceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useCreateQRSession() {
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => attendanceApi.createQRSession(data),
  });
}

export function useScanQRAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sessionCode: string; studentId: string }) =>
      attendanceApi.scanQRAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}
