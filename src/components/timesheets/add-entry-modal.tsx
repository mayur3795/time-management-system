'use client';

import React, { useState } from 'react';
import { X, Info, AlertCircle } from 'lucide-react';
import { Project } from '@/types/project';
import { TimesheetEntry, WorkType } from '@/types/timesheet';
import { WORK_TYPES } from '@/constants/work-types';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { createEntrySchema } from '@/schemas/timesheet-entry.schema';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    projectId: string;
    workType: WorkType;
    description: string;
    hours: number;
    date: string;
  }) => Promise<void>;
  projects: Project[];
  selectedDate: string;
  entryToEdit?: TimesheetEntry | null;
  timesheetTotalHours?: number;
}

interface EntryFormProps {
  onClose: () => void;
  onSubmit: AddEntryModalProps['onSubmit'];
  projects: Project[];
  selectedDate: string;
  entryToEdit?: TimesheetEntry | null;
  timesheetTotalHours?: number;
}

function EntryForm({
  onClose,
  onSubmit,
  projects,
  selectedDate,
  entryToEdit,
  timesheetTotalHours = 0,
}: EntryFormProps) {
  const isEditing = Boolean(entryToEdit);

  const [projectId, setProjectId] = useState(
    entryToEdit ? entryToEdit.projectId : (projects[0]?.id || '')
  );
  const [workType, setWorkType] = useState<WorkType>(
    entryToEdit ? entryToEdit.workType : 'Bug fixes'
  );
  const [description, setDescription] = useState(
    entryToEdit ? entryToEdit.description : ''
  );
  const [hours, setHours] = useState(entryToEdit ? entryToEdit.hours : 0.5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateWithZod = () => {
    const targetDate = entryToEdit?.date || selectedDate;
    const result = createEntrySchema.safeParse({
      projectId,
      workType,
      description,
      hours,
      date: targetDate,
    });

    const fieldErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.issues.forEach((err) => {
        const path = err.path[0];
        if (path && typeof path === 'string' && !fieldErrors[path]) {
          fieldErrors[path] = err.message;
        }
      });
    }

    const existingHoursOtherEntries =
      timesheetTotalHours - (entryToEdit ? entryToEdit.hours : 0);
    const potentialTotal = existingHoursOtherEntries + hours;

    if (potentialTotal > 40) {
      fieldErrors['hours'] = `Total weekly hours cannot exceed 40 hours.`;
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateWithZod()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await onSubmit({
        projectId,
        workType,
        description: description.trim(),
        hours,
        date: entryToEdit?.date || selectedDate,
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save entry. Please try again.';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <h2 id="modalTitle" className="text-lg md:text-xl font-bold text-[#0F172A]">
          {isEditing ? 'Edit Entry' : 'Add New Entry'}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close dialog"
          className="text-slate-500 hover:text-slate-700 min-h-[36px] min-w-[36px]"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {apiError && (
        <div
          role="alert"
          className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs md:text-sm text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="projectSelect"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5"
          >
            <span>Select Project</span>
            <span className="text-red-500">*</span>
            <span title="Select the project this task belongs to">
              <Info className="h-3.5 w-3.5 text-slate-400" />
            </span>
          </label>
          <select
            id="projectSelect"
            value={projectId}
            onChange={(e) => {
              setProjectId(e.target.value);
              if (errors.projectId) setErrors((prev) => ({ ...prev, projectId: '' }));
            }}
            disabled={isSubmitting}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 transition-colors cursor-pointer ${
              errors.projectId
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
            }`}
          >
            <option value="">Project Name</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <p className="mt-1 text-xs text-red-600">{errors.projectId}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="workTypeSelect"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5"
          >
            <span>Type of Work</span>
            <span className="text-red-500">*</span>
            <span title="Select work category">
              <Info className="h-3.5 w-3.5 text-slate-400" />
            </span>
          </label>
          <select
            id="workTypeSelect"
            value={workType}
            onChange={(e) => {
              setWorkType(e.target.value as WorkType);
              if (errors.workType) setErrors((prev) => ({ ...prev, workType: '' }));
            }}
            disabled={isSubmitting}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 transition-colors cursor-pointer ${
              errors.workType
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
            }`}
          >
            {WORK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.workType && (
            <p className="mt-1 text-xs text-red-600">{errors.workType}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="taskDescription"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5"
          >
            <span>Task description</span>
            <span className="text-red-500">*</span>
          </label>
          <textarea
            id="taskDescription"
            rows={3}
            placeholder="Write text here ..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
            disabled={isSubmitting}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 resize-y transition-colors ${
              errors.description
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
            }`}
          />
          <p className="mt-1 text-[11px] text-slate-600">A note for extra info</p>
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
            <span>Hours</span>
            <span className="text-red-500">*</span>
          </label>
          <Stepper
            value={hours}
            min={1}
            max={24}
            step={1}
            onChange={(val) => {
              setHours(val);
              if (errors.hours) setErrors((prev) => ({ ...prev, hours: '' }));
            }}
            disabled={isSubmitting}
          />
          {errors.hours && (
            <p className="mt-1 text-xs text-red-600">{errors.hours}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
          <Button
            type="submit"
            id="submitEntryButton"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full sm:w-auto flex-1 min-h-[42px]"
          >
            {isEditing ? 'Update entry' : 'Add entry'}
          </Button>

          <Button
            type="button"
            id="cancelEntryButton"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto min-h-[42px]"
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}

export function AddEntryModal({
  isOpen,
  onClose,
  onSubmit,
  projects,
  selectedDate,
  entryToEdit,
  timesheetTotalHours,
}: AddEntryModalProps) {
  if (!isOpen) return null;

  const formKey = entryToEdit ? `edit-${entryToEdit.id}` : `new-${selectedDate}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F172A]/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl bg-white p-5 sm:p-6 md:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 my-auto overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <EntryForm
          key={formKey}
          onClose={onClose}
          onSubmit={onSubmit}
          projects={projects}
          selectedDate={selectedDate}
          entryToEdit={entryToEdit}
          timesheetTotalHours={timesheetTotalHours}
        />
      </div>
    </div>
  );
}
