'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar, RotateCcw } from 'lucide-react';
import { TimesheetStatus } from '@/types/timesheet';
import { Button } from '@/components/ui/button';

interface TimesheetFiltersProps {
  startDate?: string;
  endDate?: string;
  status?: TimesheetStatus | 'ALL';
  onFilterChange: (filters: {
    startDate?: string;
    endDate?: string;
    status?: TimesheetStatus | 'ALL';
  }) => void;
  onReset: () => void;
}

export function TimesheetFilters({
  startDate,
  endDate,
  status = 'ALL',
  onFilterChange,
  onReset,
}: TimesheetFiltersProps) {
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const [customStart, setCustomStart] = useState(startDate || '');
  const [customEnd, setCustomEnd] = useState(endDate || '');

  const dateRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setDateDropdownOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleDateDropdown = () => {
    const willOpen = !dateDropdownOpen;
    if (willOpen) {
      setCustomStart(startDate || '');
      setCustomEnd(endDate || '');
      setStatusDropdownOpen(false);
    }
    setDateDropdownOpen(willOpen);
  };

  const handleApplyCustomDates = () => {
    onFilterChange({
      startDate: customStart || undefined,
      endDate: customEnd || undefined,
      status,
    });
    setDateDropdownOpen(false);
  };

  const handleSelectPreset = (start?: string, end?: string) => {
    setCustomStart(start || '');
    setCustomEnd(end || '');
    onFilterChange({
      startDate: start,
      endDate: end,
      status,
    });
    setDateDropdownOpen(false);
  };

  const handleSelectStatus = (newStatus: TimesheetStatus | 'ALL') => {
    onFilterChange({
      startDate,
      endDate,
      status: newStatus,
    });
    setStatusDropdownOpen(false);
  };

  const handleResetFilters = () => {
    setCustomStart('');
    setCustomEnd('');
    onReset();
  };

  const hasActiveFilters = Boolean(startDate || endDate || (status && status !== 'ALL'));

  const getDateRangeLabel = () => {
    if (startDate && endDate) {
      return `${startDate} → ${endDate}`;
    }
    if (startDate) return `From ${startDate}`;
    if (endDate) return `Until ${endDate}`;
    return 'Date Range';
  };

  const getStatusLabel = () => {
    if (!status || status === 'ALL') return 'Status';
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative" ref={dateRef}>
        <Button
          type="button"
          id="dateRangeFilterButton"
          variant="secondary"
          size="sm"
          aria-label="Filter timesheets by date range"
          aria-haspopup="true"
          aria-expanded={dateDropdownOpen}
          onClick={handleToggleDateDropdown}
          leftIcon={<Calendar className="h-4 w-4 text-slate-500" />}
          rightIcon={
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-500 transition-transform ${
                dateDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          }
          className={`py-2 px-3.5 font-normal ${
            startDate || endDate
              ? 'border-blue-500 bg-blue-50/40 text-blue-700 font-medium'
              : 'text-slate-700'
          }`}
        >
          <span>{getDateRangeLabel()}</span>
        </Button>

        {dateDropdownOpen && (
          <div className="absolute left-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl z-40 animate-in fade-in-50 zoom-in-95">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-semibold text-slate-800">Filter by Date</span>
              {(startDate || endDate) && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => handleSelectPreset(undefined, undefined)}
                  className="text-[11px] text-blue-700 font-medium"
                >
                  Clear
                </Button>
              )}
            </div>

            <div className="mb-3 space-y-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleSelectPreset('2024-01-01', '2024-01-31')}
                className="w-full justify-start text-xs font-normal text-slate-700"
              >
                January 2024 (Weeks 1 - 5)
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleSelectPreset('2024-02-01', '2024-02-29')}
                className="w-full justify-start text-xs font-normal text-slate-700"
              >
                February 2024 (Weeks 5 - 9)
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleSelectPreset('2024-01-01', '2024-02-29')}
                className="w-full justify-start text-xs font-normal text-slate-700"
              >
                All Available (Jan - Feb 2024)
              </Button>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-[11px] font-semibold text-slate-700 mb-2">Custom Range</p>
              <div className="space-y-2">
                <div>
                  <label htmlFor="customStartDate" className="block text-[11px] font-medium text-slate-600 mb-1">From</label>
                  <input
                    id="customStartDate"
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="customEndDate" className="block text-[11px] font-medium text-slate-600 mb-1">To</label>
                  <input
                    id="customEndDate"
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleApplyCustomDates}
                  className="w-full mt-2"
                >
                  Apply Range
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative" ref={statusRef}>
        <Button
          type="button"
          id="statusFilterButton"
          variant="secondary"
          size="sm"
          aria-label="Filter timesheets by status"
          aria-haspopup="true"
          aria-expanded={statusDropdownOpen}
          onClick={() => {
            setStatusDropdownOpen(!statusDropdownOpen);
            setDateDropdownOpen(false);
          }}
          rightIcon={
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-500 transition-transform ${
                statusDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          }
          className={`py-2 px-3.5 font-normal ${
            status && status !== 'ALL'
              ? 'border-blue-500 bg-blue-50/40 text-blue-700 font-medium'
              : 'text-slate-700'
          }`}
        >
          <span>{getStatusLabel()}</span>
        </Button>

        {statusDropdownOpen && (
          <div className="absolute left-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-40 animate-in fade-in-50 zoom-in-95">
            {(['ALL', 'COMPLETED', 'INCOMPLETE', 'MISSING'] as const).map((s) => (
              <Button
                key={s}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleSelectStatus(s)}
                className={`w-full justify-start text-xs font-normal ${
                  status === s
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700'
                }`}
              >
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleResetFilters}
          leftIcon={<RotateCcw className="h-3 w-3" />}
          className="text-slate-600 hover:text-slate-800"
        >
          <span>Reset</span>
        </Button>
      )}
    </div>
  );
}
