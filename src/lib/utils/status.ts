import { TimesheetStatus } from '@/types/timesheet';

/**
 * Calculates timesheet status based on total logged hours according to business rules:
 * - 40 hours or more -> COMPLETED
 * - Between 0 and 40 hours (> 0 and < 40) -> INCOMPLETE
 * - 0 hours -> MISSING
 */
export function getTimesheetStatus(totalHours: number): TimesheetStatus {
  if (totalHours >= 40) {
    return 'COMPLETED';
  }
  if (totalHours > 0 && totalHours < 40) {
    return 'INCOMPLETE';
  }
  return 'MISSING';
}

/**
 * Computes the total hours from an array of entries with hours.
 */
export function calculateTotalHours(entries: Array<{ hours: number }>): number {
  return entries.reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0);
}
