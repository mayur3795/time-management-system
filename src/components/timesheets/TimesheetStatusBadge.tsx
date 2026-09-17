import React from 'react';
import { TimesheetStatus } from '@/types/timesheet';

interface TimesheetStatusBadgeProps {
  status: TimesheetStatus;
  className?: string;
}

export function TimesheetStatusBadge({ status, className = '' }: TimesheetStatusBadgeProps) {
  const getBadgeStyles = (status: TimesheetStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
      case 'INCOMPLETE':
        return 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
      case 'MISSING':
        return 'bg-[#FFE4E6] text-[#E11D48] border-[#FECDD3]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-sm border text-[11px] font-bold tracking-wider uppercase ${getBadgeStyles(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
}
