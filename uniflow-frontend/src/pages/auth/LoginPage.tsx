import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, adminLoginSchema, type LoginFormData, type AdminLoginFormData } from '@/validators/auth.schema'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Card } from '@/components/common/Card'
import { useTranslation } from 'react-i18next'

export function LoginPage() {
    const [role, setRole] = useState<'student' | 'admin'>('student')
    const { login } = useAuth()
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const [globalError, setGlobalError] = useState('')

    const studentForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { phone: '', password: '' },
    })

    const adminForm = useForm<AdminLoginFormData>({
        resolver: zodResolver(adminLoginSchema),
        defaultValues: { email: '', password: '' },
    })

    // We only mock admin login for the prototype. In reality, it would hit an admin API.
    const onSubmitStudent = async (data: LoginFormData) => {
        try {
            setGlobalError('')
            const returnTo = searchParams.get('returnTo') || '/dashboard'
            await login(data.phone, data.password, returnTo)
        } catch (err) {
            setGlobalError(err instanceof Error ? err.message : t('errors.generic'))
        }
    }

    const onSubmitAdmin = (_data: AdminLoginFormData) => {
        // Prototype mock
        const returnTo = searchParams.get('returnTo') || '/dashboard'
        window.location.href = returnTo // In a real app, this would use an admin login API
    }

    return (
        <div className="max-w-md mx-auto pt-6 md:pt-14 pb-12">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">{t('auth.login')}</h1>
                <p className="text-slate-500 text-sm mt-1">Enter your credentials to continue.</p>
            </div>

            <div className="flex bg-slate-100 rounded-lg p-1 mb-5 max-w-xs mx-auto">
                <button
                    onClick={() => { setRole('student'); setGlobalError(''); studentForm.reset() }}
                    className={`flex-1 text-sm font-semibold py-2 rounded-md transition ${role === 'student' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    {t('auth.studentTab')}
                </button>
                <button
                    onClick={() => { setRole('admin'); setGlobalError(''); adminForm.reset() }}
                    className={`flex-1 text-sm font-semibold py-2 rounded-md transition ${role === 'admin' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    {t('auth.adminTab')}
                </button>
            </div>

            <Card padding="lg">
                {role === 'student' ? (
                    <form onSubmit={studentForm.handleSubmit(onSubmitStudent)} className="space-y-4">
                        <Input
                            label={t('auth.phone')}
                            placeholder={t('auth.phonePlaceholder')}
                            {...studentForm.register('phone')}
                            error={studentForm.formState.errors.phone?.message}
                        />
                        <Input
                            label={t('auth.password')}
                            type="password"
                            placeholder="••••••••"
                            {...studentForm.register('password')}
                            error={studentForm.formState.errors.password?.message}
                        />
                        {globalError && (
                            <div className="bg-danger-light border border-danger/20 rounded-lg p-3 text-xs text-danger font-medium">
                                {globalError}
                            </div>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            isLoading={studentForm.formState.isSubmitting}
                        >
                            {t('auth.loginCta')}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={adminForm.handleSubmit(onSubmitAdmin)} className="space-y-4">
                        <Input
                            label={t('auth.adminEmail')}
                            type="email"
                            placeholder="admin@example.com"
                            {...adminForm.register('email')}
                            error={adminForm.formState.errors.email?.message}
                        />
                        <Input
                            label={t('auth.password')}
                            type="password"
                            placeholder="••••••••"
                            {...adminForm.register('password')}
                            error={adminForm.formState.errors.password?.message}
                        />
                        {globalError && (
                            <div className="bg-danger-light border border-danger/20 rounded-lg p-3 text-xs text-danger font-medium">
                                {globalError}
                            </div>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            isLoading={adminForm.formState.isSubmitting}
                        >
                            {t('auth.loginCta')}
                        </Button>
                    </form>
                )}
            </Card>

            {role === 'student' && (
                <p className="text-center text-sm text-slate-500 mt-6">
                    {t('auth.noAccount')}{' '}
                    <Link to="/register" className="text-primary font-semibold hover:underline">
                        {t('auth.signUpLink')}
                    </Link>
                </p>
            )}
        </div>
    )
}
