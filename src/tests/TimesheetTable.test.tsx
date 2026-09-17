import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TimesheetTable } from '@/components/timesheets/TimesheetTable';
import { Timesheet } from '@/types/timesheet';

const mockTimesheets: Timesheet[] = [
  {
    id: 'ts-1',
    weekNumber: 1,
    year: 2024,
    startDate: '2024-01-01',
    endDate: '2024-01-05',
    totalHours: 40,
    status: 'COMPLETED',
    entries: [],
  },
  {
    id: 'ts-2',
    weekNumber: 2,
    year: 2024,
    startDate: '2024-01-08',
    endDate: '2024-01-12',
    totalHours: 24,
    status: 'INCOMPLETE',
    entries: [],
  },
  {
    id: 'ts-3',
    weekNumber: 3,
    year: 2024,
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    totalHours: 0,
    status: 'MISSING',
    entries: [],
  },
];

describe('TimesheetTable Component', () => {
  it('renders table columns correctly', () => {
    render(
      <TimesheetTable
        timesheets={mockTimesheets}
        isLoading={false}
        sortField="weekNumber"
        sortOrder="asc"
        onSort={vi.fn()}
      />
    );

    expect(screen.getByText('WEEK #')).toBeInTheDocument();
    expect(screen.getByText('DATE')).toBeInTheDocument();
    expect(screen.getByText('STATUS')).toBeInTheDocument();
    expect(screen.getByText('ACTIONS')).toBeInTheDocument();
  });

  it('renders status badges with appropriate action labels', () => {
    render(
      <TimesheetTable
        timesheets={mockTimesheets}
        isLoading={false}
        sortField="weekNumber"
        sortOrder="asc"
        onSort={vi.fn()}
      />
    );

    // Badges
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('INCOMPLETE')).toBeInTheDocument();
    expect(screen.getByText('MISSING')).toBeInTheDocument();

    // Action links: "View" for COMPLETED, "Update" for INCOMPLETE, "Create" for MISSING
    expect(screen.getByRole('link', { name: /view/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /update/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create/i })).toBeInTheDocument();
  });

  it('shows empty state when no timesheets are returned', () => {
    render(
      <TimesheetTable
        timesheets={[]}
        isLoading={false}
        sortField="weekNumber"
        sortOrder="asc"
        onSort={vi.fn()}
      />
    );

    expect(screen.getByText(/no timesheets found/i)).toBeInTheDocument();
  });
});
