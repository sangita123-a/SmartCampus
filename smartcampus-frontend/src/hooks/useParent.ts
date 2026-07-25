import { useQuery } from '@tanstack/react-query';
import { parentApi } from '@/services/parent.service';

export function useParentDashboard() {
  return useQuery({
    queryKey: ['parent', 'dashboard'],
    queryFn: () => parentApi.getDashboard(),
  });
}

export function useParentStudents() {
  return useQuery({
    queryKey: ['parent', 'students'],
    queryFn: () => parentApi.getStudents(),
  });
}

export function useParentStudentById(studentId: string) {
  return useQuery({
    queryKey: ['parent', 'students', studentId],
    queryFn: () => parentApi.getStudentById(studentId),
    enabled: Boolean(studentId),
  });
}

export function useParentAttendance(studentId?: string) {
  return useQuery({
    queryKey: ['parent', 'attendance', studentId],
    queryFn: () => parentApi.getAttendance(studentId),
  });
}

export function useParentResults(studentId?: string) {
  return useQuery({
    queryKey: ['parent', 'results', studentId],
    queryFn: () => parentApi.getResults(studentId),
  });
}

export function useParentFees(studentId?: string) {
  return useQuery({
    queryKey: ['parent', 'fees', studentId],
    queryFn: () => parentApi.getFees(studentId),
  });
}

export function useParentTimetable(studentId?: string) {
  return useQuery({
    queryKey: ['parent', 'timetable', studentId],
    queryFn: () => parentApi.getTimetable(studentId),
  });
}

export function useParentNotifications() {
  return useQuery({
    queryKey: ['parent', 'notifications'],
    queryFn: () => parentApi.getNotifications(),
  });
}
