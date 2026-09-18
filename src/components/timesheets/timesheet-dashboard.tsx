'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTimesheets } from '@/hooks/use-timesheets';
import { TimesheetFilters } from '@/components/timesheets/timesheet-filters';
import { TimesheetTable, SortField, SortOrder } from '@/components/timesheets/timesheet-table';
import { Pagination } from '@/components/timesheets/pagination';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { TimesheetStatus } from '@/types/timesheet';
import { AlertCircle } from 'lucide-react';

const entrySchema = z.object({
  hours: z.number({ invalid_type_error: 'Please enter a valid number' }).min(0.5, 'Minimum 0.5 hours').max(24, 'Maximum 24 hours'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
});

type EntryFormValues = z.infer<typeof entrySchema>;

export function TimesheetDashboard() {
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<TimesheetStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [sortField, setSortField] = useState<SortField>('weekNumber');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      hours: 8,
      description: '',
    },
  });

  const filtersParam = useMemo(
    () => ({
      startDate,
      endDate,
      status: status === 'ALL' ? undefined : status,
      page,
      limit,
    }),
    [startDate, endDate, status, page, limit]
  );

  const { data, isLoading, isError, error, refetch } = useTimesheets(filtersParam);

  const timesheetList = data?.timesheets;

  const sortedTimesheets = useMemo(() => {
    if (!timesheetList) return [];
    const items = [...timesheetList];
    items.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'weekNumber') comparison = a.weekNumber - b.weekNumber;
      else if (sortField === 'startDate') comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      else if (sortField === 'status') comparison = a.status.localeCompare(b.status);

      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return items;
  }, [timesheetList, sortField, sortOrder]);

  const totalPages = data?.pagination.totalPages || 1;
  const totalItems = data?.pagination.total || 0;

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
    setPage(1);
  };

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatus('ALL');
    setPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleFormSubmit = (values: EntryFormValues) => {
    setIsModalOpen(false);
    form.reset();
  };

  const errorMessage = error instanceof Error ? error.message : 'Unable to load timesheets. Please try again.';

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Card className="p-4 sm:p-6 md:p-8 border-0 shadow-xs">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#0F172A]">
            Your Timesheets
          </h1>
        </div>

        <div className="mb-6">
          <TimesheetFilters
            startDate={startDate}
            endDate={endDate}
            status={status}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {isError && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => refetch()}
              className="text-red-700 hover:text-red-800 font-medium"
            >
              Retry
            </Button>
          </div>
        )}

        <div className="min-h-95">
          <TimesheetTable
            timesheets={sortedTimesheets}
            isLoading={isLoading}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onResetFilters={handleResetFilters}
          />
        </div>

        <div className="mt-4 pt-6 border-t border-slate-100 min-h-16">
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
          ) : sortedTimesheets.length > 0 ? (
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
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Timesheet Entry"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours Worked</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Describe work completed..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Entry
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
    </div>
  );
}
