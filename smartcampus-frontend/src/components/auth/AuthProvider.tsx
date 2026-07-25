'use client';

import { useEffect, type ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { setAccessToken } from '@/lib/apiClient';
import { Loading } from '@/components/Loading';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Restores session on app load via httpOnly refresh cookie → new access token → /me.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const refresh = await authService.refreshToken();
        if (cancelled) return;

        if (refresh.data?.accessToken) {
          setAccessToken(refresh.data.accessToken);
          const me = await authService.me();
          if (cancelled) return;

          if (me.data?.user) {
            setAuth(me.data.user, refresh.data.accessToken);
          } else {
            clearAuth();
          }
        } else {
          clearAuth();
        }
      } catch {
        if (!cancelled) clearAuth();
      } finally {
        if (!cancelled) setHydrated(true);
      }
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [setAuth, clearAuth, setHydrated]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7faf9]">
        <Loading label="Restoring session..." fullScreen />
      </div>
    );
  }

  return <>{children}</>;
}
