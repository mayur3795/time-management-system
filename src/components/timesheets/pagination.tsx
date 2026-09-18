'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  limit,
  totalItems,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-4"
      aria-label={totalItems !== undefined ? `Pagination (${totalItems} total timesheets)` : 'Pagination'}
    >
      <div className="flex items-center gap-2">
        <label htmlFor="itemsPerPageSelect" className="sr-only">
          Items per page
        </label>
        <div className="relative inline-block">
          <select
            id="itemsPerPageSelect"
            aria-label="Items per page"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="appearance-none rounded-lg border border-[#E2E8F0] bg-white py-1.5 pl-3 pr-8 text-xs md:text-sm text-slate-700 hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
        </div>
      </div>

      <nav aria-label="Pagination Navigation" className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Previous Page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="text-slate-600 hover:text-slate-900 h-9 px-3"
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-xs text-slate-500" aria-hidden="true">
                  ...
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <Button
                key={`page-${pageNum}`}
                type="button"
                variant={isActive ? 'secondary' : 'ghost'}
                size="sm"
                aria-label={`Page ${pageNum}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[34px] h-9 font-medium ${
                  isActive
                    ? 'border border-[#1B64F2] text-[#1B64F2] bg-blue-50/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Next Page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="text-slate-600 hover:text-slate-900 h-9 px-3"
        >
          Next
        </Button>
      </nav>
    </div>
  );
}
