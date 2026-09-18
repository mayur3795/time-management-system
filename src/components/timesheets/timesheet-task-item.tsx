'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { TimesheetEntry } from '@/types/timesheet';
import { Button } from '@/components/ui/button';

interface TimesheetTaskItemProps {
  entry: TimesheetEntry;
  onEdit: (entry: TimesheetEntry) => void;
  onDelete: (entry: TimesheetEntry) => void;
}

export function TimesheetTaskItem({
  entry,
  onEdit,
  onDelete,
}: TimesheetTaskItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-slate-200/90 bg-white p-3.5 sm:px-4 sm:py-3 shadow-2xs transition-colors hover:border-slate-300 gap-2 sm:gap-4">
      <div className="min-w-0 flex-1 sm:pr-4">
        <p className="text-sm font-normal text-slate-800 break-words sm:truncate leading-relaxed">
          {entry.description}
        </p>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-normal whitespace-nowrap">
            {entry.hours} {entry.hours === 1 ? 'hr' : 'hrs'}
          </span>

          <span className="inline-flex items-center rounded-xl bg-[#E1EFFE] px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-[#1E429F] whitespace-nowrap">
            {entry.projectName}
          </span>
        </div>

        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Task actions"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 min-h-[36px] min-w-[36px]"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-1 w-28 rounded-lg border border-slate-100 bg-white p-1 shadow-lg ring-1 ring-black/5 z-30 animate-in fade-in-50 zoom-in-95"
            >
              <Button
                variant="ghost"
                size="sm"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(entry);
                }}
                className="w-full justify-start rounded px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-normal"
              >
                <span>Edit</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(entry);
                }}
                className="w-full justify-start rounded px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 font-normal"
              >
                <span>Delete</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
