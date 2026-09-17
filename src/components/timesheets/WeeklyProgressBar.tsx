'use client';

import React, { useState } from 'react';

interface WeeklyProgressBarProps {
  totalHours: number;
  targetHours?: number;
}

export function WeeklyProgressBar({
  totalHours,
  targetHours = 40,
}: WeeklyProgressBarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const percentage = Math.min(100, Math.round((totalHours / targetHours) * 100));
  const clampPercent = Math.min(100, Math.max(0, percentage));

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-[#10B981]'; // Emerald green
    if (percentage > 0) return 'bg-[#F97316]'; // Orange matching screenshot
    return 'bg-slate-200';
  };

  // Keep tooltip box centered over progress point, clamped within [16%, 84%] to prevent overflow
  const tooltipLeft = Math.max(16, Math.min(84, clampPercent));

  return (
    <div
      className="group relative w-48 sm:w-56 select-none cursor-pointer focus:outline-none"
      tabIndex={0}
      role="progressbar"
      aria-valuenow={totalHours}
      aria-valuemin={0}
      aria-valuemax={targetHours}
      aria-label={`Weekly hours progress: ${totalHours} of ${targetHours} hours (${percentage}%)`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={() => setIsHovered((prev) => !prev)}
    >
      {/* Top row: hover tooltip & 100% target marker */}
      <div className="relative flex items-center justify-end h-8 mb-1.5">
        {/* Floating Tooltip matching user screenshot */}
        <div
          className={`absolute bottom-1 -translate-x-1/2 transition-all duration-200 pointer-events-none z-20 ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-1'
          } group-hover:opacity-100 group-hover:translate-y-0 group-focus:opacity-100 group-focus:translate-y-0`}
          style={{ left: `${tooltipLeft}%` }}
        >
          <div className="relative rounded-lg border border-slate-200/90 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-md whitespace-nowrap">
            <span>{totalHours}/{targetHours} hrs</span>
            {/* Downward pointing caret/triangle */}
            <div
              className="absolute -bottom-1.25 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white border-r border-b border-slate-200/90"
              style={{
                left: `${50 + (clampPercent - tooltipLeft) * 1.4}%`,
              }}
            />
          </div>
        </div>

        {/* 100% marker at the far right matching visual reference */}
        <span
          className={`text-xs text-slate-500 font-normal transition-opacity duration-150 ${
            clampPercent > 80 && isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        >
          100%
        </span>
      </div>

      {/* Progress Track */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
