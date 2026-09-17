'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
      <Button
        type="button"
        id="stepperDecrement"
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease hours"
        className="h-9 w-9 rounded-none rounded-l-lg border-0 hover:bg-slate-50 text-slate-600"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>

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

      <Button
        type="button"
        id="stepperIncrement"
        variant="ghost"
        size="icon"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase hours"
        className="h-9 w-9 rounded-none rounded-r-lg border-0 hover:bg-slate-50 text-slate-600"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
