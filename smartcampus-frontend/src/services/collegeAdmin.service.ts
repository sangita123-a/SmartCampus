import { apiClient } from '@/lib/apiClient';

import type { ApiSuccessResponse, CollegeAdminDashboardStats } from '@/types';



export const collegeAdminService = {

  async getDashboardStats(): Promise<

    ApiSuccessResponse<{ stats: CollegeAdminDashboardStats }>

  > {

    const { data } = await apiClient.get('/college-admin/dashboard');

    return data;

  },

};

