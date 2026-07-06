import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-dark shadow-sm hover:shadow active:shadow-none shadow-primary/20',
  secondary:
    'bg-white text-text-primary border border-border/80 hover:bg-slate-50 hover:border-border active:bg-slate-100 shadow-sm',
  ghost:
    'bg-transparent text-text-secondary hover:bg-slate-50 hover:text-text-primary active:bg-slate-100',
  danger:
    'bg-danger text-white hover:bg-[#D93838] active:bg-[#B32D2D] shadow-sm hover:shadow active:shadow-none shadow-danger/20',
  accent:
    'bg-accent text-white hover:bg-[#E69500] active:bg-[#CC8400] shadow-sm hover:shadow active:shadow-none shadow-accent/20',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 h-9 text-xs rounded-lg',
  md: 'px-4 py-2.5 h-10 text-sm rounded-xl',
  lg: 'px-6 py-3 h-12 text-base rounded-2xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2 font-medium
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
