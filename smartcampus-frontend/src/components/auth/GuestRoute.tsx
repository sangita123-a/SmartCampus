'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { getDashboardPath } from '@/types/roles';

interface GuestRouteProps {
  children: ReactNode;
}

/** Redirects authenticated users away from login/register pages. */
export function GuestRoute({ children }: GuestRouteProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [isHydrated, isAuthenticated, user, router]);

  if (!isHydrated) return null;
  if (isAuthenticated && user) return null;

  return <>{children}</>;
}
