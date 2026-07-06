import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, id, className = '', ...props }, ref) => {
        const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
        return (
            <div>
                <label htmlFor={inputId} className="block text-sm font-medium mb-1.5 text-slate-700">
                    {label}
                </label>
                <input
                    ref={ref}
                    id={inputId}
                    aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                    aria-invalid={Boolean(error)}
                    className={[
                        'w-full border rounded-lg px-3.5 py-2.5 text-sm bg-surface',
                        'focus:outline-none focus:ring-2 focus:border-primary transition',
                        error
                            ? 'border-danger focus:ring-danger/30'
                            : 'border-slate-300 focus:ring-primary/30',
                        className,
                    ].join(' ')}
                    {...props}
                />
                {error && (
                    <p id={`${inputId}-error`} className="mt-1 text-xs text-danger font-medium">
                        {error}
                    </p>
                )}
                {!error && hint && (
                    <p id={`${inputId}-hint`} className="mt-1 text-xs text-slate-400">
                        {hint}
                    </p>
                )}
            </div>
        )
    },
)
Input.displayName = 'Input'
