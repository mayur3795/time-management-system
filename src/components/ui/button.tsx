import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const variantStyles = {
  default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs',
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs',
  ghost: 'hover:bg-slate-100 text-slate-700',
  destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-xs',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-xs',
  link: 'text-blue-600 underline-offset-4 hover:underline p-0 h-auto',
};

const sizeStyles = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 px-3 text-xs rounded-md',
  lg: 'h-10 px-6 text-base rounded-lg',
  icon: 'h-9 w-9 p-0',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
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
