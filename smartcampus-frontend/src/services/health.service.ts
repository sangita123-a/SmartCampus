import { apiClient } from '@/lib/apiClient';
import type { HealthStatus } from '@/types';

export const healthService = {
  async getStatus(): Promise<HealthStatus> {
    const { data } = await apiClient.get<HealthStatus>('/health');
    return data;
  },
};
