'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}: ModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F172A]/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 my-auto overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5 shrink-0">
          <h2 id="modalTitle" className="text-lg md:text-xl font-bold text-[#0F172A]">
            {title}
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

        <div className="overflow-y-auto p-5 sm:p-6 md:p-8 flex-1">{children}</div>
      </div>
    </div>
  );
}
