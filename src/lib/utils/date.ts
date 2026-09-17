/**
 * Format a start and end date into human readable range matching screenshots:
 * e.g. "1 - 5 January, 2024" or "28 January - 1 February, 2024"
 */
export function formatTimesheetDateRange(startDateStr: string, endDateStr: string): string {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const startDay = start.getUTCDate();
  const startMonth = months[start.getUTCMonth()];
  const startYear = start.getUTCFullYear();

  const endDay = end.getUTCDate();
  const endMonth = months[end.getUTCMonth()];
  const endYear = end.getUTCFullYear();

  if (startYear === endYear) {
    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth}, ${startYear}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${startYear}`;
  }

  return `${startDay} ${startMonth}, ${startYear} - ${endDay} ${endMonth}, ${endYear}`;
}

/**
 * Format a single date into short format: e.g. "Jan 21"
 */
export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  const monthsShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${monthsShort[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

/**
 * Checks if a timesheet week [timesheetStart, timesheetEnd] overlaps with a filter range [filterStart, filterEnd].
 * A week overlaps if: timesheetStart <= filterEnd AND timesheetEnd >= filterStart
 */
export function isWeekInDateRange(
  timesheetStart: string,
  timesheetEnd: string,
  filterStart?: string,
  filterEnd?: string
): boolean {
  if (!filterStart && !filterEnd) return true;

  const tStart = new Date(timesheetStart).getTime();
  const tEnd = new Date(timesheetEnd).getTime();

  if (filterStart && filterEnd) {
    const fStart = new Date(filterStart).getTime();
    const fEnd = new Date(filterEnd).getTime();
    return tStart <= fEnd && tEnd >= fStart;
  }

  if (filterStart) {
    const fStart = new Date(filterStart).getTime();
    return tEnd >= fStart;
  }

  if (filterEnd) {
    const fEnd = new Date(filterEnd).getTime();
    return tStart <= fEnd;
  }

  return true;
}

/**
 * Returns an array of YYYY-MM-DD string dates from start to end (inclusive)
 */
export function getDaysInRange(startDateStr: string, endDateStr: string): string[] {
  const days: string[] = [];
  const current = new Date(startDateStr);
  const end = new Date(endDateStr);

  while (current <= end) {
    days.push(current.toISOString().split('T')[0]);
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return days;
}
