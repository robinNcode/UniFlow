import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/validators/auth.schema';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { GraduationCap } from 'lucide-react';

export default function RegisterPage() {
    const { registerMutation } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

    const onSubmit = (data: RegisterFormData) => {
        registerMutation.mutate({
            fullName: data.fullName,
            phone: data.phone,
            password: data.password,
        });
    };

    return (
        <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2.5 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">
                            Uni<span className="text-primary">Flow</span>
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Takes about a minute. You'll use your phone number to log in.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-surface border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm"
                    noValidate
                >
                    <Input
                        label="Full Name"
                        placeholder="As per your SSC certificate"
                        autoComplete="name"
                        error={errors.fullName?.message}
                        {...register('fullName')}
                        required
                    />
                    <div>
                        <Input
                            label="Phone Number"
                            placeholder="01XXXXXXXXX"
                            type="tel"
                            autoComplete="tel"
                            error={errors.phone?.message}
                            {...register('phone')}
                            required
                        />
                        <p className="text-xs text-slate-400 mt-1.5">
                            Accepts 01XXXXXXXXX or +8801XXXXXXXXX format.
                        </p>
                    </div>

                    <Input
                        label="Password"
                        placeholder="At least 8 characters"
                        type="password"
                        autoComplete="new-password"
                        error={errors.password?.message}
                        {...register('password')}
                        required
                    />
                    <Input
                        label="Confirm Password"
                        placeholder="Re-enter password"
                        type="password"
                        autoComplete="new-password"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                        required
                    />

                    {registerMutation.isError && (
                        <div className="bg-danger-light border border-danger/20 rounded-lg px-3.5 py-2.5 text-xs text-danger font-medium">
                            {registerMutation.error?.message ?? 'Registration failed. Please try again.'}
                        </div>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        className="py-3 mt-2"
                        isLoading={registerMutation.isPending}
                    >
                        Create Account
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-5">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
