import { forwardRef, useId, type ReactNode, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, hint, leftIcon, rightIcon, fullWidth = true, className = '', ...props },
    ref,
  ) => {
    const inputId = useId();

    const inputBase = [
      'flex w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm transition-all shadow-sm',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-slate-400',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ].join(' ');

    const inputBorder = error
      ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/20'
      : 'border-slate-300 hover:border-slate-400';

    const helperMsg = helperText ?? hint;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className} flex flex-col space-y-1.5`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-slate-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex h-full items-center justify-center text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`${inputBase} ${inputBorder} ${leftIcon ? 'pl-9' : ''} ${rightIcon ? 'pr-9' : ''}`}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperMsg ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex h-full items-center justify-center text-slate-400 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-[0.8rem] font-medium text-danger">
            {error}
          </p>
        )}
        {helperMsg && !error && (
          <p id={`${inputId}-helper`} className="text-[0.8rem] text-slate-500">
            {helperMsg}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
