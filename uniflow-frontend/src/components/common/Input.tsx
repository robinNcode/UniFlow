import { forwardRef, useId, type ReactNode, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, leftIcon, rightIcon, fullWidth = true, className = '', ...props },
    ref
  ) => {
    const inputId = useId();

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label} {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              block w-full rounded-xl border border-border bg-white px-4 py-3 h-12
              text-sm text-text-primary shadow-sm
              placeholder:text-text-muted
              transition-all duration-200 ease-in-out
              hover:border-primary/50
              focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary
              disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-text-muted disabled:border-border-light
              ${leftIcon ? 'pl-11' : ''}
              ${rightIcon ? 'pr-11' : ''}
              ${error ? 'border-danger bg-danger-light/10 focus:border-danger focus:ring-danger/20 hover:border-danger' : ''}
            `}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            id={error ? `${inputId}-error` : `${inputId}-helper`}
            className={`mt-1.5 text-xs font-medium animate-slide-down ${
              error ? 'text-danger' : 'text-text-secondary'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
