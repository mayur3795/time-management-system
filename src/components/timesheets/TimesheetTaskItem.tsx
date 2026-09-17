'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { TimesheetEntry } from '@/types/timesheet';

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
    <div className="group flex items-center justify-between rounded-lg border border-slate-200/90 bg-white px-4 py-3 shadow-2xs transition-colors hover:border-slate-300">
      {/* Left: Task description */}
      <div className="min-w-0 flex-1 pr-4">
        <p className="truncate text-sm font-normal text-slate-800">
          {entry.description}
        </p>
      </div>

      {/* Right: Hours, Project tag, 3-dots action */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        <span className="text-xs text-slate-500 font-normal whitespace-nowrap">
          {entry.hours} {entry.hours === 1 ? 'hr' : 'hrs'}
        </span>

        <span className="text-xs font-normal text-[#1B64F2] hover:underline whitespace-nowrap">
          {entry.projectName}
        </span>

        {/* 3-dots action menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Actions"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-1 w-28 rounded-lg border border-slate-100 bg-white p-1 shadow-lg ring-1 ring-black/5 z-30 animate-in fade-in-50 zoom-in-95"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(entry);
                }}
                className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>Edit</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(entry);
                }}
                className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
