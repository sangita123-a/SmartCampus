import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@/services/report.service';
import { ReportFilterParams } from '@/types/report';

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ['reports', 'dashboard'],
    queryFn: () => reportApi.getDashboardAnalytics(),
  });
}

export function useStudentReports(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports', 'students', params],
    queryFn: () => reportApi.getStudentReports(params),
  });
}

export function useFacultyReports(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports', 'faculty', params],
    queryFn: () => reportApi.getFacultyReports(params),
  });
}

export function useAttendanceReports(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports', 'attendance', params],
    queryFn: () => reportApi.getAttendanceReports(params),
  });
}

export function useFeeReports(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports', 'fees', params],
    queryFn: () => reportApi.getFeeReports(params),
  });
}

export function useExamReports(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports', 'exams', params],
    queryFn: () => reportApi.getExamReports(params),
  });
}

export function useLibraryReports() {
  return useQuery({
    queryKey: ['reports', 'library'],
    queryFn: () => reportApi.getLibraryReports(),
  });
}
