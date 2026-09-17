import { describe, it, expect } from 'vitest';
import { getTimesheetStatus, calculateTotalHours } from '@/lib/utils/status';

describe('Timesheet Status Calculation Logic', () => {
  it('should return COMPLETED when total hours are 40 or more', () => {
    expect(getTimesheetStatus(40)).toBe('COMPLETED');
    expect(getTimesheetStatus(45)).toBe('COMPLETED');
  });

  it('should return INCOMPLETE when total hours are greater than 0 but less than 40', () => {
    expect(getTimesheetStatus(20)).toBe('INCOMPLETE');
    expect(getTimesheetStatus(0.5)).toBe('INCOMPLETE');
    expect(getTimesheetStatus(39)).toBe('INCOMPLETE');
  });

  it('should return MISSING when total hours are 0', () => {
    expect(getTimesheetStatus(0)).toBe('MISSING');
  });

  it('should accurately calculate total hours from entries', () => {
    const entries = [
      { hours: 4 },
      { hours: 6 },
      { hours: 8 },
    ];
    expect(calculateTotalHours(entries)).toBe(18);
  });
});
