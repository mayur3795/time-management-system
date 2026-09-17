'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function Stepper({
  value,
  min = 1,
  max = 24,
  step = 1,
  onChange,
  disabled = false,
}: StepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(Math.max(min, value - step));
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(Math.min(max, value + step));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onChange(Math.min(max, Math.max(min, val)));
    }
  };

  return (
    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs">
      <button
        type="button"
        id="stepperDecrement"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease hours"
        className="flex h-9 w-9 items-center justify-center rounded-l-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <input
        type="number"
        id="stepperInput"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleInputChange}
        disabled={disabled}
        className="h-9 w-14 border-x border-slate-200 text-center text-sm font-medium text-slate-800 focus:outline-none focus:bg-blue-50/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        type="button"
        id="stepperIncrement"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase hours"
        className="flex h-9 w-9 items-center justify-center rounded-r-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
