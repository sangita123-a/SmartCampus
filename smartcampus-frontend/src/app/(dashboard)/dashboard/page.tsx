'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { getDashboardPath } from '@/types/roles';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Loading } from '@/components/Loading';

export default function DashboardIndexPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, router]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen items-center justify-center">
        <Loading label="Redirecting to your dashboard..." fullScreen />
      </div>
    </ProtectedRoute>
  );
}
