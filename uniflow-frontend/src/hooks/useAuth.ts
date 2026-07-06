import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/endpoints/auth.api';
import { normalizeBdPhoneNumber } from '@/utils/phoneValidation';
import type { LoginRequest, RegisterRequest } from '@/api/types/common.types';
import { toast } from 'sonner';

/**
 * Auth hook — wraps login/register mutations and auth state management.
 */
export function useAuth() {
  const { setAuth, logout, isAuthenticated, student } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => {
      const normalized = normalizeBdPhoneNumber(data.phone);
      if (!normalized) throw new Error('Invalid phone number format');
      return authApi.login({ ...data, phone: normalized });
    },
    onSuccess: (data) => {
      setAuth(data.token, data.student);
      toast.success('Welcome back!');
      const returnTo = searchParams.get('returnTo') || '/dashboard';
      navigate(returnTo);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => {
      const normalized = normalizeBdPhoneNumber(data.phone);
      if (!normalized) throw new Error('Invalid phone number format');
      return authApi.register({ ...data, phone: normalized });
    },
    onSuccess: (data) => {
      setAuth(data.token, data.student);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    },
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('You have been signed out.');
  };

  return {
    loginMutation,
    registerMutation,
    logout: handleLogout,
    isAuthenticated,
    student,
  };
}
