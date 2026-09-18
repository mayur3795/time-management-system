import { TimesheetStatus } from '@/types/timesheet';

export function getTimesheetStatus(totalHours: number): TimesheetStatus {
  if (totalHours >= 40) {
    return 'COMPLETED';
  }
  if (totalHours > 0 && totalHours < 40) {
    return 'INCOMPLETE';
  }
  return 'MISSING';
}

export function calculateTotalHours(entries: Array<{ hours: number }>): number {
  return entries.reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0);
}
