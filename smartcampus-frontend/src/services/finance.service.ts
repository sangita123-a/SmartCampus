import { api } from '@/lib/api';
import {
  CollectPaymentPayload,
  FeeCategory,
  FeeStructure,
  FinanceDashboardCardsData,
  PaymentRecord,
  StudentFeeRecord,
} from '@/types/finance';

export const financeApi = {
  // Fee Categories
  listCategories: async (params?: Record<string, unknown>) => {
    const res = await api.get<{ success: boolean; data: FeeCategory[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/finance/categories', { params });
    return res.data;
  },

  getCategoryById: async (id: string) => {
    const res = await api.get<{ success: boolean; data: FeeCategory }>(`/finance/categories/${id}`);
    return res.data.data;
  },

  createCategory: async (data: Partial<FeeCategory>) => {
    const res = await api.post<{ success: boolean; data: FeeCategory }>('/finance/categories', data);
    return res.data.data;
  },

  updateCategory: async (id: string, data: Partial<FeeCategory>) => {
    const res = await api.put<{ success: boolean; data: FeeCategory }>(`/finance/categories/${id}`, data);
    return res.data.data;
  },

  deleteCategory: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/finance/categories/${id}`);
    return res.data;
  },

  // Fee Structures
  listStructures: async (params?: Record<string, unknown>) => {
    const res = await api.get<{ success: boolean; data: FeeStructure[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/finance/structures', { params });
    return res.data;
  },

  createStructure: async (data: Partial<FeeStructure>) => {
    const res = await api.post<{ success: boolean; data: FeeStructure }>('/finance/structures', data);
    return res.data.data;
  },

  updateStructure: async (id: string, data: Partial<FeeStructure>) => {
    const res = await api.put<{ success: boolean; data: FeeStructure }>(`/finance/structures/${id}`, data);
    return res.data.data;
  },

  deleteStructure: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/finance/structures/${id}`);
    return res.data;
  },

  // Student Fees
  generateFees: async (data: { feeStructureId: string }) => {
    const res = await api.post<{ success: boolean; message: string; generatedCount: number }>('/finance/student-fees/generate', data);
    return res.data;
  },

  listStudentFees: async (params?: Record<string, unknown>) => {
    const res = await api.get<{ success: boolean; data: StudentFeeRecord[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/finance/student-fees', { params });
    return res.data;
  },

  getStudentFeeById: async (id: string) => {
    const res = await api.get<{ success: boolean; data: StudentFeeRecord }>(`/finance/student-fees/${id}`);
    return res.data.data;
  },

  getStudentLedger: async (studentId: string) => {
    const res = await api.get<{ success: boolean; data: { student: unknown; summary: { totalFeesAssigned: number; totalDiscounts: number; totalPaid: number; totalOutstanding: number }; feeRecords: StudentFeeRecord[] } }>(`/finance/student-fees/ledger/${studentId}`);
    return res.data.data;
  },

  // Payments & Receipts
  collectPayment: async (data: CollectPaymentPayload) => {
    const res = await api.post<{ success: boolean; data: { payment: PaymentRecord; studentFee: StudentFeeRecord } }>('/finance/payments', data);
    return res.data.data;
  },

  listPayments: async (params?: Record<string, unknown>) => {
    const res = await api.get<{ success: boolean; data: PaymentRecord[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/finance/payments', { params });
    return res.data;
  },

  getPaymentById: async (id: string) => {
    const res = await api.get<{ success: boolean; data: PaymentRecord }>(`/finance/payments/${id}`);
    return res.data.data;
  },

  // Dashboard & Analytics
  getDashboardCards: async () => {
    const res = await api.get<{ success: boolean; data: FinanceDashboardCardsData }>('/finance/dashboard');
    return res.data.data;
  },

  getCollectionReports: async () => {
    const res = await api.get<{ success: boolean; data: { departmentWise: { department: string; total: number }[]; courseWise: { course: string; total: number }[]; semesterWise: { semester: string; total: number }[] } }>('/finance/reports/collection');
    return res.data.data;
  },
};
