import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/endpoints/auth.api'

export function useAuth() {
    const { token, student, setAuth, clearAuth } = useAuthStore()
    const navigate = useNavigate()

    const isAuthenticated = Boolean(token && student)

    const login = useCallback(
        async (phone: string, password: string, returnTo?: string) => {
            const data = await authApi.login({ phone, password })
            setAuth(data.token, data.student)
            navigate(returnTo ?? '/dashboard', { replace: true })
        },
        [setAuth, navigate],
    )

    const logout = useCallback(() => {
        clearAuth()
        navigate('/login', { replace: true })
    }, [clearAuth, navigate])

    return { token, student, isAuthenticated, login, logout }
}
