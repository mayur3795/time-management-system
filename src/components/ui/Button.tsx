'use client';

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'outline'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60';

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-[#1B64F2] text-white hover:bg-[#1557D0] active:scale-[0.99] shadow-xs disabled:hover:bg-[#1B64F2]',
      secondary:
        'bg-white text-slate-700 border border-[#E2E8F0] hover:bg-slate-50 hover:text-slate-900 shadow-2xs',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.99] shadow-xs',
      ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      outline:
        'bg-transparent border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/20 hover:text-[#1B64F2]',
      link:
        'bg-transparent text-[#1B64F2] hover:text-[#1557D0] hover:underline p-0 h-auto',
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
      md: 'text-sm px-4 py-2.5 rounded-lg gap-2',
      lg: 'text-base px-6 py-3 rounded-lg gap-2.5',
      icon: 'p-1.5 rounded-md h-8 w-8',
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${
      variant !== 'link' ? sizeStyles[size] : ''
    } ${className}`.trim();

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
