import { apiClient } from '@/lib/apiClient';

import type {

  ApiSuccessResponse,

  Department,

  DepartmentListParams,

  DepartmentPayload,

  PaginatedResponse,

} from '@/types';



function toQuery(params: DepartmentListParams = {}): string {

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {

    if (value !== undefined && value !== null && value !== '') {

      searchParams.set(key, String(value));

    }

  });

  const query = searchParams.toString();

  return query ? `?${query}` : '';

}



export const departmentService = {

  async list(

    params?: DepartmentListParams

  ): Promise<ApiSuccessResponse<PaginatedResponse<Department>>> {

    const { data } = await apiClient.get(`/departments${toQuery(params)}`);

    return data;

  },



  async getById(id: string): Promise<ApiSuccessResponse<{ department: Department }>> {

    const { data } = await apiClient.get(`/departments/${id}`);

    return data;

  },



  async create(

    payload: DepartmentPayload

  ): Promise<ApiSuccessResponse<{ department: Department }>> {

    const { data } = await apiClient.post('/departments', payload);

    return data;

  },



  async update(

    id: string,

    payload: Partial<DepartmentPayload>

  ): Promise<ApiSuccessResponse<{ department: Department }>> {

    const { data } = await apiClient.put(`/departments/${id}`, payload);

    return data;

  },



  async toggleStatus(id: string): Promise<ApiSuccessResponse<{ department: Department }>> {

    const { data } = await apiClient.patch(`/departments/${id}/toggle-status`);

    return data;

  },



  async remove(id: string): Promise<ApiSuccessResponse> {

    const { data } = await apiClient.delete(`/departments/${id}`);

    return data;

  },

};

