'use client';

import { useQuery } from '@tanstack/react-query';
import { healthService } from '@/services/health.service';

export const healthKeys = {
  all: ['health'] as const,
  status: () => [...healthKeys.all, 'status'] as const,
};

export function useHealthStatus() {
  return useQuery({
    queryKey: healthKeys.status(),
    queryFn: () => healthService.getStatus(),
  });
}
