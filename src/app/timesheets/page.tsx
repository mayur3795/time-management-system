'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TimesheetFilters } from '@/components/timesheets/TimesheetFilters';
import { TimesheetTable } from '@/components/timesheets/TimesheetTable';
import { Pagination } from '@/components/timesheets/Pagination';
import { getTimesheets } from '@/lib/api/client';
import { Timesheet, TimesheetStatus } from '@/types/timesheet';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TimesheetsDashboardPage() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and pagination state
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<TimesheetStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Sort state
  const [sortField, setSortField] = useState<'weekNumber' | 'startDate' | 'status'>('weekNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchTimesheets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTimesheets({
        startDate,
        endDate,
        status: status === 'ALL' ? undefined : status,
        page,
        limit,
      });

      let sorted = [...response.timesheets];
      sorted.sort((a, b) => {
        let comp = 0;
        if (sortField === 'weekNumber') comp = a.weekNumber - b.weekNumber;
        else if (sortField === 'startDate') comp = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        else if (sortField === 'status') comp = a.status.localeCompare(b.status);

        return sortOrder === 'asc' ? comp : -comp;
      });

      setTimesheets(sorted);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.total);
    } catch (err) {
      console.error('Failed to load timesheets:', err);
      setError('Unable to load timesheets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, status, page, limit, sortField, sortOrder]);

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  const handleFilterChange = (newFilters: {
    startDate?: string;
    endDate?: string;
    status?: TimesheetStatus | 'ALL';
  }) => {
    setStartDate(newFilters.startDate);
    setEndDate(newFilters.endDate);
    if (newFilters.status !== undefined) {
      setStatus(newFilters.status);
    }
    setPage(1); // Reset to first page on filter change
  };

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatus('ALL');
    setPage(1);
  };

  const handleSort = (field: 'weekNumber' | 'startDate' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Main Card matching Screenshot 2 */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-xs">
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#0F172A]">
                Your Timesheets
              </h1>
            </div>

            {/* Filter controls bar */}
            <div className="mb-6">
              <TimesheetFilters
                startDate={startDate}
                endDate={endDate}
                status={status}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={fetchTimesheets}
                  className="font-medium text-red-700 hover:text-red-800"
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Table */}
            <TimesheetTable
              timesheets={timesheets}
              isLoading={isLoading}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              onResetFilters={handleResetFilters}
            />

            {/* Pagination footer with persistent border and placeholder to eliminate CLS */}
            <div className="mt-4 pt-6 border-t border-slate-100 min-h-[64px]">
              {isLoading ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
                  <div className="h-8 w-28 bg-slate-100 rounded-lg" />
                  <div className="flex items-center gap-1">
                    <div className="h-8 w-16 bg-slate-100 rounded-md" />
                    <div className="h-8 w-8 bg-slate-100 rounded-md" />
                    <div className="h-8 w-8 bg-slate-100 rounded-md" />
                    <div className="h-8 w-16 bg-slate-100 rounded-md" />
                  </div>
                </div>
              ) : timesheets.length > 0 ? (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  limit={limit}
                  totalItems={totalItems}
                  onPageChange={(newPage) => setPage(newPage)}
                  onLimitChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
