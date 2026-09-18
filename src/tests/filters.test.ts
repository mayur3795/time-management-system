import { describe, it, expect } from 'vitest';
import { isWeekInDateRange } from '@/lib/utils/date';
import { TimesheetStore } from '@/server/timesheet-store';

describe('Timesheet Date Range and Status Filtering', () => {
  it('detects when a week overlaps with a filter range', () => {
    const tsStart = '2024-01-08';
    const tsEnd = '2024-01-12';

    expect(isWeekInDateRange(tsStart, tsEnd, '2024-01-01', '2024-01-31')).toBe(true);
    expect(isWeekInDateRange(tsStart, tsEnd, '2024-02-01', '2024-02-28')).toBe(false);
    expect(isWeekInDateRange(tsStart, tsEnd, '2024-01-10', '2024-01-20')).toBe(true);
  });

  it('returns all applicable weeks when a selected date range spans multiple weeks', async () => {
    const result = await TimesheetStore.getTimesheets({
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      limit: 20,
    });

    expect(result.timesheets.length).toBeGreaterThanOrEqual(4);
    const weekNumbers = result.timesheets.map((ts) => ts.weekNumber);
    expect(weekNumbers).toContain(1);
    expect(weekNumbers).toContain(2);
    expect(weekNumbers).toContain(3);
    expect(weekNumbers).toContain(4);
  });

  it('filters correctly by status', async () => {
    const completedResult = await TimesheetStore.getTimesheets({
      status: 'COMPLETED',
      limit: 20,
    });
    expect(completedResult.timesheets.every((ts) => ts.status === 'COMPLETED')).toBe(true);

    const incompleteResult = await TimesheetStore.getTimesheets({
      status: 'INCOMPLETE',
      limit: 20,
    });
    expect(incompleteResult.timesheets.every((ts) => ts.status === 'INCOMPLETE')).toBe(true);

    const missingResult = await TimesheetStore.getTimesheets({
      status: 'MISSING',
      limit: 20,
    });
    expect(missingResult.timesheets.every((ts) => ts.status === 'MISSING')).toBe(true);
  });
});
