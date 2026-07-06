import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth store — Zustand
 * Holds JWT token and current student profile only.
 * Server data lives in React Query cache, not here.
 */

interface StudentProfile {
  id: string;
  fullName: string;
  phone: string;
}

interface AuthState {
  token: string | null;
  student: StudentProfile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, student: StudentProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      student: null,
      isAuthenticated: false,

      setAuth: (token, student) =>
        set({
          token,
          student,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          student: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'uniflow-auth',
      partialize: (state) => ({
        token: state.token,
        student: state.student,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
