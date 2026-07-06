import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
    token: string | null
    student: {
        id: string
        fullName: string
        phone: string
    } | null
    setAuth: (token: string, student: AuthState['student']) => void
    clearAuth: () => void
}

// Token and minimal student profile only — server data lives in React Query cache.
// Persisted to localStorage so sessions survive page refreshes.
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            student: null,
            setAuth: (token, student) => set({ token, student }),
            clearAuth: () => set({ token: null, student: null }),
        }),
        { name: 'auth-storage' },
    ),
)
