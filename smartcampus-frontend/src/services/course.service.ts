import { apiClient } from '@/lib/apiClient';

import type {

  ApiSuccessResponse,

  Course,

  CourseListParams,

  CoursePayload,

  PaginatedResponse,

} from '@/types';



function toQuery(params: CourseListParams = {}): string {

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {

    if (value !== undefined && value !== null && value !== '') {

      searchParams.set(key, String(value));

    }

  });

  const query = searchParams.toString();

  return query ? `?${query}` : '';

}



export const courseService = {

  async list(

    params?: CourseListParams

  ): Promise<ApiSuccessResponse<PaginatedResponse<Course>>> {

    const { data } = await apiClient.get(`/courses${toQuery(params)}`);

    return data;

  },



  async getById(id: string): Promise<ApiSuccessResponse<{ course: Course }>> {

    const { data } = await apiClient.get(`/courses/${id}`);

    return data;

  },



  async create(payload: CoursePayload): Promise<ApiSuccessResponse<{ course: Course }>> {

    const { data } = await apiClient.post('/courses', payload);

    return data;

  },



  async update(

    id: string,

    payload: Partial<CoursePayload>

  ): Promise<ApiSuccessResponse<{ course: Course }>> {

    const { data } = await apiClient.put(`/courses/${id}`, payload);

    return data;

  },



  async toggleStatus(id: string): Promise<ApiSuccessResponse<{ course: Course }>> {

    const { data } = await apiClient.patch(`/courses/${id}/toggle-status`);

    return data;

  },



  async remove(id: string): Promise<ApiSuccessResponse> {

    const { data } = await apiClient.delete(`/courses/${id}`);

    return data;

  },

};

