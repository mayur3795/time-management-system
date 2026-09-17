'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WeeklyProgressBar } from '@/components/timesheets/WeeklyProgressBar';
import { TimesheetTaskItem } from '@/components/timesheets/TimesheetTaskItem';
import { AddEntryModal } from '@/components/timesheets/AddEntryModal';
import { DeleteConfirmModal } from '@/components/timesheets/DeleteConfirmModal';
import {
  getTimesheet,
  getProjects,
  createTimesheetEntry,
  updateTimesheetEntry,
  deleteTimesheetEntry,
} from '@/lib/api/client';
import { Timesheet, TimesheetEntry, WorkType } from '@/types/timesheet';
import { Project } from '@/types/project';
import { formatTimesheetDateRange, formatShortDate, getDaysInRange } from '@/lib/utils/date';

export default function TimesheetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayDate, setSelectedDayDate] = useState<string>('');
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);

  // Delete modal state
  const [deletingEntry, setDeletingEntry] = useState<TimesheetEntry | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [tsData, projData] = await Promise.all([
        getTimesheet(id),
        getProjects(),
      ]);
      setTimesheet(tsData);
      setProjects(projData);
    } catch (err) {
      console.error('Failed to load timesheet detail:', err);
      setError('Unable to load timesheet details. It may not exist.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      // Update entry
      const response = await updateTimesheetEntry(timesheet.id, editingEntry.id, {
        projectId: data.projectId,
        workType: data.workType,
        description: data.description,
        hours: data.hours,
        date: data.date,
      });
      setTimesheet(response.timesheet);
    } else {
      // Create new entry
      const response = await createTimesheetEntry(timesheet.id, {
        projectId: data.projectId,
        workType: data.workType,
        description: data.description,
        hours: data.hours,
        date: data.date,
      });
      setTimesheet(response.timesheet);
    }
  };

  const handleConfirmDelete = async () => {
    if (!timesheet || !deletingEntry) return;

    const response = await deleteTimesheetEntry(timesheet.id, deletingEntry.id);
    setTimesheet(response.timesheet);
    setDeletingEntry(null);
  };

  if (isLoading) {
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

  if (error || !timesheet) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1 py-12 px-4 text-center">
          <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-xs">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
            <h2 className="text-lg font-bold text-slate-800 mb-1">Timesheet Not Found</h2>
            <p className="text-sm text-slate-500 mb-6">{error || 'The requested timesheet does not exist.'}</p>
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
          {/* Back button */}
          <div className="mb-4">
            <Link
              href="/timesheets"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Timesheets</span>
            </Link>
          </div>

          {/* Main Card matching Screenshot 3 */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-xs">
            {/* Header row: Title & Date range on left, Progress bar on right */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-100">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
                  This week&apos;s timesheet
                </h1>
                <p className="text-xs text-slate-400 font-normal mt-1">
                  {formatTimesheetDateRange(timesheet.startDate, timesheet.endDate)}
                </p>
              </div>

              {/* Progress Bar matching Screenshot 3 */}
              <WeeklyProgressBar totalHours={timesheet.totalHours} targetHours={40} />
            </div>

            {/* Vertical Days layout */}
            <div className="space-y-8">
              {daysOfWeek.map((dayDate, dayIdx) => {
                const dayEntries = timesheet.entries.filter((e) => e.date === dayDate);
                const isFirstDay = dayIdx === 0;

                return (
                  <div
                    key={dayDate}
                    className="flex flex-col md:flex-row gap-2 md:gap-8 items-start"
                  >
                    {/* Day label */}
                    <div className="w-20 pt-2 shrink-0">
                      <span className="text-sm font-semibold text-slate-800">
                        {formatShortDate(dayDate)}
                      </span>
                    </div>

                    {/* Day entries & Add task button */}
                    <div className="flex-1 w-full space-y-2.5">
                      {dayEntries.map((entry) => (
                        <TimesheetTaskItem
                          key={entry.id}
                          entry={entry}
                          onEdit={handleOpenEditModal}
                          onDelete={handleOpenDeleteModal}
                        />
                      ))}

                      {/* Add new task button */}
                      <button
                        type="button"
                        onClick={() => handleOpenAddModal(dayDate)}
                        className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs md:text-sm font-medium transition-all cursor-pointer ${
                          isFirstDay && dayEntries.length === 0
                            ? 'border border-blue-200 bg-blue-50/50 text-[#1B64F2] hover:bg-blue-50'
                            : 'border border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-blue-50/20 hover:text-[#1B64F2]'
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add new task</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Add / Edit Entry Modal */}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingEntry)}
        entry={deletingEntry}
        onClose={() => setDeletingEntry(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
