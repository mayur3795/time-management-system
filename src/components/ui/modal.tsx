'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={cn(
          'w-full max-w-lg bg-white p-6 shadow-2xl transition-all rounded-t-2xl md:rounded-xl max-h-[85vh] md:max-h-none overflow-y-auto',
          className
        )}
      >
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 md:hidden" />
        {title && (
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
