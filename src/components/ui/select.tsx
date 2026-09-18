'use client';

import React, { forwardRef } from 'react';
import { Info } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  tooltip?: string;
  required?: boolean;
  options?: SelectOption[];
  placeholderOption?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      tooltip,
      required,
      options,
      placeholderOption,
      id,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5"
          >
            <span>{label}</span>
            {required && <span className="text-red-500 ml-1">*</span>}
            {tooltip && (
              <span title={tooltip}>
                <Info className="h-3.5 w-3.5 text-slate-400" />
              </span>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 transition-colors cursor-pointer ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
          } ${className}`}
          {...props}
        >
          {placeholderOption && <option value="">{placeholderOption}</option>}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
