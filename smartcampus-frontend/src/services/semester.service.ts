import { apiClient } from '@/lib/apiClient';

import type {

  ApiSuccessResponse,

  PaginatedResponse,

  Semester,

  SemesterListParams,

  SemesterPayload,

} from '@/types';



function toQuery(params: SemesterListParams = {}): string {

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {

    if (value !== undefined && value !== null && value !== '') {

      searchParams.set(key, String(value));

    }

  });

  const query = searchParams.toString();

  return query ? `?${query}` : '';

}



export const semesterService = {

  async list(

    params?: SemesterListParams

  ): Promise<ApiSuccessResponse<PaginatedResponse<Semester>>> {

    const { data } = await apiClient.get(`/semesters${toQuery(params)}`);

    return data;

  },



  async getById(id: string): Promise<ApiSuccessResponse<{ semester: Semester }>> {

    const { data } = await apiClient.get(`/semesters/${id}`);

    return data;

  },



  async create(

    payload: SemesterPayload

  ): Promise<ApiSuccessResponse<{ semester: Semester }>> {

    const { data } = await apiClient.post('/semesters', payload);

    return data;

  },



  async update(

    id: string,

    payload: Partial<SemesterPayload>

  ): Promise<ApiSuccessResponse<{ semester: Semester }>> {

    const { data } = await apiClient.put(`/semesters/${id}`, payload);

    return data;

  },



  async toggleStatus(id: string): Promise<ApiSuccessResponse<{ semester: Semester }>> {

    const { data } = await apiClient.patch(`/semesters/${id}/toggle-status`);

    return data;

  },



  async remove(id: string): Promise<ApiSuccessResponse> {

    const { data } = await apiClient.delete(`/semesters/${id}`);

    return data;

  },

};

