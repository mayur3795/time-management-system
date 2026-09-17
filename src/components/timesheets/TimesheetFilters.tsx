'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar, X, RotateCcw } from 'lucide-react';
import { TimesheetStatus } from '@/types/timesheet';

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

  // Local state for custom date inputs
  const [customStart, setCustomStart] = useState(startDate || '');
  const [customEnd, setCustomEnd] = useState(endDate || '');

  const dateRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomStart(startDate || '');
    setCustomEnd(endDate || '');
  }, [startDate, endDate]);

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
      {/* Date Range Dropdown */}
      <div className="relative" ref={dateRef}>
        <button
          type="button"
          id="dateRangeFilterButton"
          onClick={() => {
            setDateDropdownOpen(!dateDropdownOpen);
            setStatusDropdownOpen(false);
          }}
          className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs md:text-sm font-normal transition-colors ${
            startDate || endDate
              ? 'border-blue-500 bg-blue-50/40 text-blue-700 font-medium'
              : 'border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>{getDateRangeLabel()}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
              dateDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {dateDropdownOpen && (
          <div className="absolute left-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl z-40 animate-in fade-in-50 zoom-in-95">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-semibold text-slate-800">Filter by Date</span>
              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={() => handleSelectPreset(undefined, undefined)}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Presets */}
            <div className="mb-3 space-y-1">
              <button
                type="button"
                onClick={() => handleSelectPreset('2024-01-01', '2024-01-31')}
                className="w-full text-left rounded-md px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
              >
                January 2024 (Weeks 1 - 5)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('2024-02-01', '2024-02-29')}
                className="w-full text-left rounded-md px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
              >
                February 2024 (Weeks 5 - 9)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('2024-01-01', '2024-02-29')}
                className="w-full text-left rounded-md px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
              >
                All Available (Jan - Feb 2024)
              </button>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-[11px] font-medium text-slate-500 mb-2">Custom Range</p>
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] text-slate-500">From</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500">To</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCustomDates}
                  className="w-full mt-2 rounded-md bg-[#1B64F2] py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Apply Range
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Dropdown */}
      <div className="relative" ref={statusRef}>
        <button
          type="button"
          id="statusFilterButton"
          onClick={() => {
            setStatusDropdownOpen(!statusDropdownOpen);
            setDateDropdownOpen(false);
          }}
          className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs md:text-sm font-normal transition-colors ${
            status && status !== 'ALL'
              ? 'border-blue-500 bg-blue-50/40 text-blue-700 font-medium'
              : 'border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>{getStatusLabel()}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
              statusDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {statusDropdownOpen && (
          <div className="absolute left-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-40 animate-in fade-in-50 zoom-in-95">
            {(['ALL', 'COMPLETED', 'INCOMPLETE', 'MISSING'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSelectStatus(s)}
                className={`w-full text-left rounded-lg px-3 py-2 text-xs md:text-sm transition-colors ${
                  status === s
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reset filters button if active */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}
