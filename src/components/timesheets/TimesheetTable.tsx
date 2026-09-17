'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Timesheet } from '@/types/timesheet';
import { TimesheetStatusBadge } from './TimesheetStatusBadge';
import { formatTimesheetDateRange } from '@/lib/utils/date';

type SortField = 'weekNumber' | 'startDate' | 'status';
type SortOrder = 'asc' | 'desc';

interface TimesheetTableProps {
  timesheets: Timesheet[];
  isLoading: boolean;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onResetFilters?: () => void;
}

export function TimesheetTable({
  timesheets,
  isLoading,
  sortField,
  sortOrder,
  onSort,
  onResetFilters,
}: TimesheetTableProps) {
  const getActionLabel = (status: Timesheet['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'View';
      case 'INCOMPLETE':
        return 'Update';
      case 'MISSING':
        return 'Create';
      default:
        return 'View';
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-3 w-3 text-slate-300 ml-1 inline-block" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-blue-600 ml-1 inline-block" />
    ) : (
      <ArrowDown className="h-3 w-3 text-blue-600 ml-1 inline-block" />
    );
  };

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-4">WEEK #</th>
              <th className="py-4 px-4">DATE</th>
              <th className="py-4 px-4">STATUS</th>
              <th className="py-4 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="animate-pulse">
                <td className="py-5 px-4">
                  <div className="h-4 w-16 bg-slate-200 rounded"></div>
                </td>
                <td className="py-5 px-4">
                  <div className="h-4 w-36 bg-slate-200 rounded"></div>
                </td>
                <td className="py-5 px-4">
                  <div className="h-5 w-24 bg-slate-200 rounded-sm"></div>
                </td>
                <td className="py-5 px-4 text-right">
                  <div className="h-4 w-12 bg-slate-200 rounded ml-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (timesheets.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto max-w-sm">
          <p className="text-base font-semibold text-slate-800 mb-1">No timesheets found</p>
          <p className="text-xs md:text-sm text-slate-500 mb-4">
            No timesheets match your current date range or status filters.
          </p>
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="rounded-lg bg-blue-50 px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <th
              onClick={() => onSort('weekNumber')}
              className="py-4 px-4 cursor-pointer hover:text-slate-600 transition-colors select-none"
            >
              <div className="flex items-center">
                <span>WEEK #</span>
                {renderSortIcon('weekNumber')}
              </div>
            </th>
            <th
              onClick={() => onSort('startDate')}
              className="py-4 px-4 cursor-pointer hover:text-slate-600 transition-colors select-none"
            >
              <div className="flex items-center">
                <span>DATE</span>
                {renderSortIcon('startDate')}
              </div>
            </th>
            <th
              onClick={() => onSort('status')}
              className="py-4 px-4 cursor-pointer hover:text-slate-600 transition-colors select-none"
            >
              <div className="flex items-center">
                <span>STATUS</span>
                {renderSortIcon('status')}
              </div>
            </th>
            <th className="py-4 px-4 text-right">
              <span>ACTIONS</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
          {timesheets.map((ts) => (
            <tr
              key={ts.id}
              className="hover:bg-slate-50/60 transition-colors group"
            >
              <td className="py-4 px-4 font-normal text-slate-800">
                {ts.weekNumber}
              </td>
              <td className="py-4 px-4 font-normal text-slate-600">
                {formatTimesheetDateRange(ts.startDate, ts.endDate)}
              </td>
              <td className="py-4 px-4">
                <TimesheetStatusBadge status={ts.status} />
              </td>
              <td className="py-4 px-4 text-right">
                <Link
                  href={`/timesheets/${ts.id}`}
                  className="font-medium text-[#1B64F2] hover:text-[#1557D0] transition-colors"
                >
                  {getActionLabel(ts.status)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
