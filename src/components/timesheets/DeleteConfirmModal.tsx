'use client';

import React, { useState } from 'react';
import { Trash2, Loader2, X } from 'lucide-react';
import { TimesheetEntry } from '@/types/timesheet';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  entry: TimesheetEntry | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({
  isOpen,
  entry,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !entry) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-rose-600">
            <Trash2 className="h-5 w-5" />
            <h3 className="text-base font-bold text-slate-900">Delete Entry</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-2">
          Are you sure you want to delete this timesheet entry?
        </p>

        <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3 mb-5 text-xs text-slate-700">
          <p className="font-semibold text-slate-900 truncate">{entry.description}</p>
          <p className="text-slate-500 mt-0.5">
            {entry.hours} {entry.hours === 1 ? 'hr' : 'hrs'} • {entry.projectName}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs md:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirmDeleteButton"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs md:text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-70 transition-colors cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete entry</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
