'use client';

import React, { useState, useEffect } from 'react';
import { X, Info, AlertCircle } from 'lucide-react';
import { Project } from '@/types/project';
import { TimesheetEntry, WorkType } from '@/types/timesheet';
import { Stepper } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';

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
}

const WORK_TYPES: WorkType[] = [
  'Bug fixes',
  'Feature Development',
  'Code Review',
  'Testing',
  'Meeting',
  'Research',
  'Other',
];

export function AddEntryModal({
  isOpen,
  onClose,
  onSubmit,
  projects,
  selectedDate,
  entryToEdit,
}: AddEntryModalProps) {
  const isEditing = Boolean(entryToEdit);

  const [projectId, setProjectId] = useState('');
  const [workType, setWorkType] = useState<WorkType>('Bug fixes');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Field validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (entryToEdit) {
      setProjectId(entryToEdit.projectId);
      setWorkType(entryToEdit.workType);
      setDescription(entryToEdit.description);
      setHours(entryToEdit.hours);
    } else {
      setProjectId(projects[0]?.id || '');
      setWorkType('Bug fixes');
      setDescription('');
      setHours(4);
    }
    setErrors({});
    setApiError(null);
  }, [entryToEdit, projects, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!projectId.trim()) {
      newErrors.projectId = 'Please select a project.';
    }
    if (!workType) {
      newErrors.workType = 'Please select a type of work.';
    }
    if (!description.trim()) {
      newErrors.description = 'Please provide a task description.';
    }
    if (!hours || hours <= 0) {
      newErrors.hours = 'Hours must be greater than 0.';
    } else if (hours > 24) {
      newErrors.hours = 'Hours cannot exceed 24 hours in a single day.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 md:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <h2 id="modalTitle" className="text-lg md:text-xl font-bold text-[#0F172A]">
            {isEditing ? 'Edit Entry' : 'Add New Entry'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600"
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
          {/* Select Project */}
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
                if (errors.projectId) setErrors({ ...errors, projectId: '' });
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

          {/* Type of Work */}
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
                if (errors.workType) setErrors({ ...errors, workType: '' });
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

          {/* Task Description */}
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
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              disabled={isSubmitting}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 resize-y transition-colors ${
                errors.description
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            <p className="mt-1 text-[11px] text-slate-400">A note for extra info</p>
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Hours Stepper */}
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
                if (errors.hours) setErrors({ ...errors, hours: '' });
              }}
              disabled={isSubmitting}
            />
            {errors.hours && (
              <p className="mt-1 text-xs text-red-600">{errors.hours}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
            <Button
              type="submit"
              id="submitEntryButton"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full sm:w-auto flex-1"
            >
              {isEditing ? 'Update entry' : 'Add entry'}
            </Button>

            <Button
              type="button"
              id="cancelEntryButton"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
