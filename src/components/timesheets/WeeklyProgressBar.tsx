'use client';

import React from 'react';

interface WeeklyProgressBarProps {
  totalHours: number;
  targetHours?: number;
}

export function WeeklyProgressBar({
  totalHours,
  targetHours = 40,
}: WeeklyProgressBarProps) {
  const percentage = Math.min(100, Math.round((totalHours / targetHours) * 100));

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-[#10B981]'; // Emerald green
    if (percentage > 0) return 'bg-[#F97316]'; // Orange / Amber matching screenshot 3
    return 'bg-slate-300';
  };

  return (
    <div
      className="w-48 sm:w-56 text-right"
      role="progressbar"
      aria-valuenow={totalHours}
      aria-valuemin={0}
      aria-valuemax={targetHours}
      aria-label="Weekly hours progress"
    >
      <div className="flex items-center justify-between text-xs font-semibold mb-1 text-slate-800">
        <span>{totalHours}/{targetHours} hrs</span>
        <span className="text-slate-600 font-normal">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
