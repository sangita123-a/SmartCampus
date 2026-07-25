'use client';



import { useQuery } from '@tanstack/react-query';

import { collegeAdminService } from '@/services/collegeAdmin.service';



export const collegeAdminKeys = {

  all: ['college-admin'] as const,

  dashboard: () => [...collegeAdminKeys.all, 'dashboard'] as const,

};



export function useCollegeAdminDashboard() {

  return useQuery({

    queryKey: collegeAdminKeys.dashboard(),

    queryFn: async () => {

      const response = await collegeAdminService.getDashboardStats();

      if (!response.data?.stats) throw new Error('Failed to load dashboard stats');

      return response.data.stats;

    },

  });

}

