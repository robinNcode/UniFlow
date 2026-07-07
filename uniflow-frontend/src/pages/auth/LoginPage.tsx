import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/validators/auth.schema';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function LoginPage() {
  const { loginMutation } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({ phone: data.phone, password: data.password });
  };

  return (
    <div className="max-w-md mx-auto pt-6 md:pt-14 pb-10 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Log in to uniFlow</h1>
        <p className="text-slate-500 text-sm mt-1">Enter your credentials to continue.</p>
      </div>

      <div className="flex bg-slate-100 rounded-lg p-1 mb-5 max-w-xs mx-auto">
        <button className="flex-1 text-sm font-semibold py-2 rounded-md bg-white shadow-sm text-primary">Student</button>
        <button className="flex-1 text-sm font-semibold py-2 rounded-md text-slate-500">Admin</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-slate-200 rounded-xl p-6 space-y-4" noValidate>
        <Input
          label="Phone Number"
          placeholder="01XXXXXXXXX"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone')}
          required
        />
        <Input
          label="Password"
          placeholder="••••••••"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
          required
        />

        {loginMutation.isError && (
          <div className="bg-danger-light border border-danger/20 rounded-lg px-3.5 py-2.5 text-xs text-danger font-medium">
            {loginMutation.error.message}
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          className="py-3"
          isLoading={loginMutation.isPending}
        >
          Log In
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
