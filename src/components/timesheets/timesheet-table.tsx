'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Timesheet } from '@/types/timesheet';
import { TimesheetStatusBadge } from './timesheet-status-badge';
import { formatTimesheetDateRange } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';

export type SortField = 'weekNumber' | 'startDate' | 'status';
export type SortOrder = 'asc' | 'desc';

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

  const getAriaSort = (field: SortField): 'ascending' | 'descending' | 'none' => {
    if (sortField !== field) return 'none';
    return sortOrder === 'asc' ? 'ascending' : 'descending';
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400 ml-1 inline-block" aria-hidden="true" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-blue-600 ml-1 inline-block" aria-hidden="true" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-blue-600 ml-1 inline-block" aria-hidden="true" />
    );
  };

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto min-h-[360px]">
        <table className="w-full text-left border-collapse" aria-label="Timesheets table loading">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th scope="col" className="py-4 px-4">
                <div className="flex items-center">
                  <span>WEEK #</span>
                  <ChevronsUpDown className="h-3.5 w-3.5 text-transparent ml-1 inline-block" aria-hidden="true" />
                </div>
              </th>
              <th scope="col" className="py-4 px-4">
                <div className="flex items-center">
                  <span>DATE</span>
                  <ChevronsUpDown className="h-3.5 w-3.5 text-transparent ml-1 inline-block" aria-hidden="true" />
                </div>
              </th>
              <th scope="col" className="py-4 px-4">
                <div className="flex items-center">
                  <span>STATUS</span>
                  <ChevronsUpDown className="h-3.5 w-3.5 text-transparent ml-1 inline-block" aria-hidden="true" />
                </div>
              </th>
              <th scope="col" className="py-4 px-4 text-right">
                <span>ACTIONS</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="animate-pulse h-[53px]">
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="h-4 w-12 bg-slate-200 rounded"></div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="h-4 w-36 bg-slate-200 rounded"></div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
                </td>
                <td className="py-4 px-4 text-right whitespace-nowrap">
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
      <div className="py-16 text-center min-h-[360px] flex flex-col items-center justify-center">
        <div className="mx-auto max-w-sm">
          <p className="text-base font-semibold text-slate-800 mb-1">No timesheets found</p>
          <p className="text-xs md:text-sm text-slate-600 mb-4">
            No timesheets match your current date range or status filters.
          </p>
          {onResetFilters && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onResetFilters}
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-transparent"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto min-h-[360px]">
      <table className="w-full text-left border-collapse" aria-label="Timesheets">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            <th
              scope="col"
              aria-sort={getAriaSort('weekNumber')}
              onClick={() => onSort('weekNumber')}
              className="py-4 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
            >
              <div className="flex items-center">
                <span>WEEK #</span>
                {renderSortIcon('weekNumber')}
              </div>
            </th>
            <th
              scope="col"
              aria-sort={getAriaSort('startDate')}
              onClick={() => onSort('startDate')}
              className="py-4 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
            >
              <div className="flex items-center">
                <span>DATE</span>
                {renderSortIcon('startDate')}
              </div>
            </th>
            <th
              scope="col"
              aria-sort={getAriaSort('status')}
              onClick={() => onSort('status')}
              className="py-4 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
            >
              <div className="flex items-center">
                <span>STATUS</span>
                {renderSortIcon('status')}
              </div>
            </th>
            <th scope="col" className="py-4 px-4 text-right">
              <span>ACTIONS</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
          {timesheets.map((ts) => (
            <tr
              key={ts.id}
              className="hover:bg-slate-50/60 transition-colors group h-[53px]"
            >
              <td className="py-4 px-4 font-normal text-slate-800 whitespace-nowrap">
                {ts.weekNumber}
              </td>
              <td className="py-4 px-4 font-normal text-slate-600 whitespace-nowrap">
                {formatTimesheetDateRange(ts.startDate, ts.endDate)}
              </td>
              <td className="py-4 px-4 whitespace-nowrap">
                <TimesheetStatusBadge status={ts.status} />
              </td>
              <td className="py-4 px-4 text-right whitespace-nowrap">
                <Link
                  href={`/timesheets/${ts.id}`}
                  aria-label={`${getActionLabel(ts.status)} Timesheet for Week ${ts.weekNumber}`}
                  className="font-medium text-[#1B64F2] hover:text-[#1557D0] transition-colors py-1.5 px-2.5 rounded-md hover:bg-blue-50/50 inline-flex items-center"
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
