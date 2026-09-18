'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
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

export default function TimesheetDetailPage() {
  const params = useParams();
  const id = params?.id as string;

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
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-xl border border-slate-200 bg-white p-8 animate-pulse">
              <div className="h-6 w-48 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-slate-200 rounded mb-8"></div>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-slate-100 rounded-lg"></div>
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
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 py-12 px-4 text-center">
          <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-xs">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
            <h2 className="text-lg font-bold text-slate-800 mb-1">Timesheet Not Found</h2>
            <p className="text-sm text-slate-500 mb-6">{errorMessage}</p>
            <Link
              href="/timesheets"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1B64F2] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4">
            <Link
              href="/timesheets"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Timesheets</span>
            </Link>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-100">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
                  This week&apos;s timesheet
                </h1>
                <p className="text-xs text-slate-600 font-normal mt-1">
                  {formatTimesheetDateRange(timesheet.startDate, timesheet.endDate)}
                </p>
              </div>

              <WeeklyProgressBar totalHours={timesheet.totalHours} targetHours={40} />
            </div>

            <div className="space-y-8">
              {daysOfWeek.map((dayDate, dayIdx) => {
                const dayEntries = timesheet.entries.filter((e) => e.date === dayDate);
                const isFirstDay = dayIdx === 0;

                return (
                  <div
                    key={dayDate}
                    className="flex flex-col md:flex-row gap-2 md:gap-8 items-start"
                  >
                    <div className="w-20 pt-2 shrink-0">
                      <span className="text-sm font-semibold text-slate-800">
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
                        className={`w-full py-2.5 text-xs md:text-sm font-medium ${
                          isFirstDay && dayEntries.length === 0
                            ? 'border-blue-200 bg-blue-50/50 text-[#1B64F2] hover:bg-blue-50'
                            : 'border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-blue-50/20 hover:text-[#1B64F2]'
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
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
        }}
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
