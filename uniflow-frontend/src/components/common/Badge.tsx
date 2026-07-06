interface BadgeProps {
    children: React.ReactNode
    variant?: 'default' | 'success' | 'danger' | 'accent' | 'primary'
    className?: string
}

import React from 'react'

const variantClasses = {
    default: 'bg-slate-100 text-slate-500',
    success: 'bg-success-light text-success',
    danger: 'bg-danger-light text-danger',
    accent: 'bg-accent-light text-accent',
    primary: 'bg-primary-light text-primary',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    return (
        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    )
}
