'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Loading } from '@/components/Loading';
import { Role, getDashboardPath } from '@/types/roles';
import { useCurrentUser } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);
  const { isLoading, isError } = useCurrentUser(isAuthenticated);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || isError) {
      router.replace('/login');
      return;
    }

    if (user && allowedRoles && allowedRoles.length > 0) {
      if (user.role !== Role.SUPER_ADMIN && !allowedRoles.includes(user.role)) {
        router.replace(getDashboardPath(user.role));
      }
    }
  }, [isHydrated, isAuthenticated, isError, user, allowedRoles, router]);

  if (!isHydrated || (isAuthenticated && isLoading && !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading label="Verifying session..." fullScreen />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    user.role !== Role.SUPER_ADMIN &&
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}
