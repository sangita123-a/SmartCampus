import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '@/services/finance.service';
import { CollectPaymentPayload, FeeCategory, FeeStructure } from '@/types/finance';

export function useFeeCategories(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['finance', 'categories', params],
    queryFn: () => financeApi.listCategories(params),
  });
}

export function useCreateFeeCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<FeeCategory>) => financeApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'categories'] });
    },
  });
}

export function useUpdateFeeCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FeeCategory> }) => financeApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'categories'] });
    },
  });
}

export function useDeleteFeeCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financeApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'categories'] });
    },
  });
}

export function useFeeStructures(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['finance', 'structures', params],
    queryFn: () => financeApi.listStructures(params),
  });
}

export function useCreateFeeStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<FeeStructure>) => financeApi.createStructure(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'structures'] });
    },
  });
}

export function useUpdateFeeStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FeeStructure> }) => financeApi.updateStructure(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'structures'] });
    },
  });
}

export function useDeleteFeeStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financeApi.deleteStructure(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'structures'] });
    },
  });
}

export function useGenerateStudentFees() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { feeStructureId: string }) => financeApi.generateFees(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance'] });
    },
  });
}

export function useStudentFees(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['finance', 'student-fees', params],
    queryFn: () => financeApi.listStudentFees(params),
  });
}

export function useStudentFeeDetails(id: string) {
  return useQuery({
    queryKey: ['finance', 'student-fees', id],
    queryFn: () => financeApi.getStudentFeeById(id),
    enabled: Boolean(id),
  });
}

export function useStudentLedger(studentId?: string) {
  return useQuery({
    queryKey: ['finance', 'ledger', studentId],
    queryFn: () => financeApi.getStudentLedger(studentId!),
    enabled: Boolean(studentId),
  });
}

export function useCollectPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CollectPaymentPayload) => financeApi.collectPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance'] });
    },
  });
}

export function usePayments(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['finance', 'payments', params],
    queryFn: () => financeApi.listPayments(params),
  });
}

export function usePaymentDetails(id: string) {
  return useQuery({
    queryKey: ['finance', 'payments', id],
    queryFn: () => financeApi.getPaymentById(id),
    enabled: Boolean(id),
  });
}

export function useFinanceDashboard() {
  return useQuery({
    queryKey: ['finance', 'dashboard'],
    queryFn: () => financeApi.getDashboardCards(),
  });
}

export function useFinanceReports() {
  return useQuery({
    queryKey: ['finance', 'reports'],
    queryFn: () => financeApi.getCollectionReports(),
  });
}
