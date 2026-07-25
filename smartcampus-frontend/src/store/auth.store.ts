import { create } from 'zustand';
import type { User } from '@/types';
import { setAccessToken } from '@/lib/apiClient';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrated: false,

  setAuth: (user, accessToken) => {
    setAccessToken(accessToken);
    set({ user, accessToken, isAuthenticated: true });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  clearAuth: () => {
    setAccessToken(null);
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  setHydrated: (value) => set({ isHydrated: value }),
}));
