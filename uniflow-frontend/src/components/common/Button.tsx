import React from 'react'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
    isLoading?: boolean
    fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
    primary: 'bg-primary text-white hover:bg-primary-hover disabled:opacity-50',
    secondary: 'bg-surface border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50',
    danger: 'bg-danger text-white hover:opacity-90 disabled:opacity-50',
    ghost: 'text-primary hover:bg-primary-light disabled:opacity-50',
    accent: 'bg-accent text-white hover:opacity-90 disabled:opacity-50',
}

const sizeClasses: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { variant = 'primary', size = 'md', isLoading = false, fullWidth = false, children, className = '', disabled, ...props },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={[
                    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition select-none',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                    variantClasses[variant],
                    sizeClasses[size],
                    fullWidth ? 'w-full' : '',
                    isLoading ? 'cursor-not-allowed' : '',
                    className,
                ].join(' ')}
                {...props}
            >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />}
                {children}
            </button>
        )
    },
)
Button.displayName = 'Button'
