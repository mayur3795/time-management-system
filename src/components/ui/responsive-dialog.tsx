'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ResponsiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function ResponsiveDialog({ isOpen, onClose, title, children }: ResponsiveDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="w-full max-w-lg bg-white shadow-2xl p-6 transition-all duration-200 rounded-t-2xl md:rounded-xl max-h-[85vh] md:max-h-none overflow-y-auto"
      >
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 md:hidden" />
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 id="dialog-title" className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
