import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthStore, UserRole } from '../types';
import { STORAGE_KEYS } from '../utils/localStorage';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (role: UserRole, name?: string) => {
        set({
          user: { role, name },
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH,
    }
  )
);
