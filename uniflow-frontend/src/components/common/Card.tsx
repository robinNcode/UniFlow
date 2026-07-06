import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
    return (
        <div
            className={[
                'bg-surface border border-slate-200 rounded-xl',
                paddingClasses[padding],
                className,
            ].join(' ')}
        >
            {children}
        </div>
    )
}
