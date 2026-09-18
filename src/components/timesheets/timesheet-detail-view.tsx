'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WeeklyProgressBar } from '@/components/timesheets/weekly-progress-bar';
import { TimesheetTaskItem } from '@/components/timesheets/timesheet-task-item';
import { AddEntryModal } from '@/components/timesheets/add-entry-modal';
import { DeleteConfirmModal } from '@/components/timesheets/delete-confirm-modal';
import { Button } from '@/components/ui/button';
import {
  useCreateTimesheetEntry,
  useDeleteTimesheetEntry,
  useTimesheet,
  useUpdateTimesheetEntry,
} from '@/hooks/use-timesheets';
import { useProjects } from '@/hooks/use-projects';
import { TimesheetEntry, WorkType } from '@/types/timesheet';
import { formatTimesheetDateRange, formatShortDate, getDaysInRange } from '@/lib/utils/date';

interface TimesheetDetailViewProps {
  id: string;
}

export function TimesheetDetailView({ id }: TimesheetDetailViewProps) {
  const { data: timesheet, isLoading: isTimesheetLoading, isError, error } = useTimesheet(id);
  const { data: projects = [] } = useProjects();

  const createMutation = useCreateTimesheetEntry(id);
  const updateMutation = useUpdateTimesheetEntry(id);
  const deleteMutation = useDeleteTimesheetEntry(id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayDate, setSelectedDayDate] = useState<string>('');
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<TimesheetEntry | null>(null);

  const handleOpenAddModal = (date: string) => {
    setSelectedDayDate(date);
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry: TimesheetEntry) => {
    setSelectedDayDate(entry.date);
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (entry: TimesheetEntry) => {
    setDeletingEntry(entry);
  };

  const handleSaveEntry = async (data: {
    projectId: string;
    workType: WorkType;
    description: string;
    hours: number;
    date: string;
  }) => {
    if (!timesheet) return;

    if (editingEntry) {
      await updateMutation.mutateAsync({
        entryId: editingEntry.id,
        payload: {
          projectId: data.projectId,
          workType: data.workType,
          description: data.description,
          hours: data.hours,
          date: data.date,
        },
      });
    } else {
      await createMutation.mutateAsync({
        projectId: data.projectId,
        workType: data.workType,
        description: data.description,
        hours: data.hours,
        date: data.date,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!timesheet || !deletingEntry) return;

    await deleteMutation.mutateAsync(deletingEntry.id);
    setDeletingEntry(null);
  };

  if (isTimesheetLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-light">
        <Header />
        <main className="flex-1 py-5 sm:py-8 px-3.5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="h-5 w-36 bg-slate-200 rounded-md animate-pulse" />
            <div className="rounded-xl bg-white p-4 sm:p-6 md:p-8 shadow-xs animate-pulse space-y-6 min-h-125">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 min-h-16">
                <div className="space-y-2">
                  <div className="h-7 w-52 bg-slate-200 rounded-md" />
                  <div className="h-4 w-36 bg-slate-100 rounded-md" />
                </div>
                <div className="h-8 w-48 bg-slate-200 rounded-full" />
              </div>
              <div className="space-y-6 min-h-87.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="min-h-30 rounded-lg bg-slate-50 border border-slate-100 p-4" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !timesheet) {
    const errorMessage = error instanceof Error ? error.message : 'The requested timesheet does not exist.';

    return (
      <div className="min-h-screen flex flex-col bg-bg-light">
        <Header />
        <main className="flex-1 py-12 px-4 text-center">
          <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-xs">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
            <h2 className="text-lg font-bold text-slate-800 mb-1">Timesheet Not Found</h2>
            <p className="text-sm text-slate-500 mb-6">{errorMessage}</p>
            <Link
              href="/timesheets"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 outline-none focus:ring-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Timesheets</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const daysOfWeek = getDaysInRange(timesheet.startDate, timesheet.endDate);

  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      <Header />

      <main className="flex-1 py-5 sm:py-8 px-3.5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4">
            <Link
              href="/timesheets"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors py-1 px-1 rounded outline-none border-0 focus:outline-none focus:ring-0 select-none"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Timesheets</span>
            </Link>
          </div>

          <div className="rounded-xl border-0 bg-white p-4 sm:p-6 md:p-8 shadow-xs min-h-125">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-slate-100 min-h-16">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
                  This week&apos;s timesheet
                </h1>
                <p className="text-xs text-slate-600 font-normal mt-1">
                  {formatTimesheetDateRange(timesheet.startDate, timesheet.endDate)}
                </p>
              </div>

              <div className="w-full sm:w-auto flex justify-start sm:justify-end min-h-10">
                <WeeklyProgressBar totalHours={timesheet.totalHours} targetHours={40} />
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8 min-h-87.5">
              {daysOfWeek.map((dayDate, index) => {
                const dayEntries = timesheet.entries.filter((entry) => entry.date === dayDate);
                const isFirstDay = index === 0;

                return (
                  <div
                    key={dayDate}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8 last:border-b-0 min-h-30"
                  >
                    <div className="w-full sm:w-36 shrink-0">
                      <span className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                        {formatShortDate(dayDate)}
                      </span>
                    </div>

                    <div className="flex-1 w-full space-y-2.5">
                      {dayEntries.map((entry) => (
                        <TimesheetTaskItem
                          key={entry.id}
                          entry={entry}
                          onEdit={handleOpenEditModal}
                          onDelete={handleOpenDeleteModal}
                        />
                      ))}

                      <Button
                        type="button"
                        variant={isFirstDay && dayEntries.length === 0 ? 'secondary' : 'outline'}
                        onClick={() => handleOpenAddModal(dayDate)}
                        leftIcon={<Plus className="h-4 w-4" />}
                        className={`w-full py-2.5 text-xs md:text-sm font-medium min-h-10.5 ${
                          isFirstDay && dayEntries.length === 0
                            ? 'border-blue-200 bg-blue-50/50 text-brand-blue hover:bg-blue-50'
                            : 'border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-blue-50/20 hover:text-brand-blue'
                        }`}
                      >
                        Add new task
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveEntry}
        projects={projects}
        selectedDate={selectedDayDate}
        entryToEdit={editingEntry}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingEntry)}
        entry={deletingEntry}
        onClose={() => setDeletingEntry(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
