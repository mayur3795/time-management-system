import {
  CreateEntryPayload,
  PaginatedTimesheetsResponse,
  Timesheet,
  TimesheetEntry,
  TimesheetFilters,
  UpdateEntryPayload,
} from '@/types/timesheet';
import { INITIAL_TIMESHEETS } from '@/lib/mocks/timesheets';
import { MOCK_PROJECTS } from '@/lib/mocks/projects';
import { calculateTotalHours, getTimesheetStatus } from '@/lib/utils/status';
import { isWeekInDateRange } from '@/lib/utils/date';

// Global reference to retain in-memory state across Next.js dev server reloads
const globalStore = globalThis as unknown as {
  _timesheetDataStore?: Timesheet[];
};

function getStore(): Timesheet[] {
  if (!globalStore._timesheetDataStore) {
    // Deep clone initial data so mutations don't corrupt constants
    globalStore._timesheetDataStore = JSON.parse(JSON.stringify(INITIAL_TIMESHEETS));
  }
  return globalStore._timesheetDataStore!;
}

export class TimesheetService {
  /**
   * Reset store to initial state
   */
  static resetStore(): void {
    globalStore._timesheetDataStore = JSON.parse(JSON.stringify(INITIAL_TIMESHEETS));
  }

  /**
   * Get filtered and paginated timesheets
   */
  static async getTimesheets(filters: TimesheetFilters = {}): Promise<PaginatedTimesheetsResponse> {
    const store = getStore();
    const { startDate, endDate, status, page = 1, limit = 5 } = filters;

    let filtered = [...store];

    // Filter by Date Range (multi-week overlap support)
    if (startDate || endDate) {
      filtered = filtered.filter((ts) =>
        isWeekInDateRange(ts.startDate, ts.endDate, startDate, endDate)
      );
    }

    // Filter by Status
    if (status && status !== 'ALL') {
      filtered = filtered.filter((ts) => ts.status.toUpperCase() === status.toUpperCase());
    }

    const total = filtered.length;
    const validLimit = Math.max(1, limit);
    const totalPages = Math.ceil(total / validLimit) || 1;
    const validPage = Math.min(Math.max(1, page), totalPages);

    const startIndex = (validPage - 1) * validLimit;
    const paginatedTimesheets = filtered.slice(startIndex, startIndex + validLimit);

    return {
      timesheets: paginatedTimesheets,
      pagination: {
        total,
        page: validPage,
        limit: validLimit,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPrevPage: validPage > 1,
      },
    };
  }

  /**
   * Get single timesheet by ID with all its entries
   */
  static async getTimesheetById(id: string): Promise<Timesheet | null> {
    const store = getStore();
    const timesheet = store.find((ts) => ts.id === id);
    if (!timesheet) return null;
    return JSON.parse(JSON.stringify(timesheet));
  }

  /**
   * Add a new entry to a timesheet
   */
  static async addEntry(
    timesheetId: string,
    payload: CreateEntryPayload
  ): Promise<{ entry: TimesheetEntry; timesheet: Timesheet }> {
    const store = getStore();
    const timesheet = store.find((ts) => ts.id === timesheetId);

    if (!timesheet) {
      throw new Error(`Timesheet with id ${timesheetId} not found`);
    }

    const project = MOCK_PROJECTS.find((p) => p.id === payload.projectId);
    const projectName = project ? project.name : 'Unknown Project';

    const newEntry: TimesheetEntry = {
      id: `ent-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timesheetId,
      date: payload.date,
      projectId: payload.projectId,
      projectName,
      workType: payload.workType,
      description: payload.description,
      hours: Number(payload.hours),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    timesheet.entries.push(newEntry);

    // Recalculate total hours and status
    timesheet.totalHours = calculateTotalHours(timesheet.entries);
    timesheet.status = getTimesheetStatus(timesheet.totalHours);

    return {
      entry: JSON.parse(JSON.stringify(newEntry)),
      timesheet: JSON.parse(JSON.stringify(timesheet)),
    };
  }

  /**
   * Update an existing entry
   */
  static async updateEntry(
    timesheetId: string,
    entryId: string,
    payload: UpdateEntryPayload
  ): Promise<{ entry: TimesheetEntry; timesheet: Timesheet }> {
    const store = getStore();
    const timesheet = store.find((ts) => ts.id === timesheetId);

    if (!timesheet) {
      throw new Error(`Timesheet with id ${timesheetId} not found`);
    }

    const entryIndex = timesheet.entries.findIndex((e) => e.id === entryId);
    if (entryIndex === -1) {
      throw new Error(`Entry with id ${entryId} not found in timesheet ${timesheetId}`);
    }

    const existingEntry = timesheet.entries[entryIndex];
    let projectName = existingEntry.projectName;

    if (payload.projectId && payload.projectId !== existingEntry.projectId) {
      const project = MOCK_PROJECTS.find((p) => p.id === payload.projectId);
      if (project) {
        projectName = project.name;
      }
    }

    const updatedEntry: TimesheetEntry = {
      ...existingEntry,
      ...(payload.date !== undefined && { date: payload.date }),
      ...(payload.projectId !== undefined && { projectId: payload.projectId }),
      projectName,
      ...(payload.workType !== undefined && { workType: payload.workType }),
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.hours !== undefined && { hours: Number(payload.hours) }),
      updatedAt: new Date().toISOString(),
    };

    timesheet.entries[entryIndex] = updatedEntry;

    // Recalculate total hours and status
    timesheet.totalHours = calculateTotalHours(timesheet.entries);
    timesheet.status = getTimesheetStatus(timesheet.totalHours);

    return {
      entry: JSON.parse(JSON.stringify(updatedEntry)),
      timesheet: JSON.parse(JSON.stringify(timesheet)),
    };
  }

  /**
   * Delete an entry from a timesheet
   */
  static async deleteEntry(
    timesheetId: string,
    entryId: string
  ): Promise<{ success: boolean; timesheet: Timesheet }> {
    const store = getStore();
    const timesheet = store.find((ts) => ts.id === timesheetId);

    if (!timesheet) {
      throw new Error(`Timesheet with id ${timesheetId} not found`);
    }

    const entryIndex = timesheet.entries.findIndex((e) => e.id === entryId);
    if (entryIndex === -1) {
      throw new Error(`Entry with id ${entryId} not found in timesheet ${timesheetId}`);
    }

    timesheet.entries.splice(entryIndex, 1);

    // Recalculate total hours and status
    timesheet.totalHours = calculateTotalHours(timesheet.entries);
    timesheet.status = getTimesheetStatus(timesheet.totalHours);

    return {
      success: true,
      timesheet: JSON.parse(JSON.stringify(timesheet)),
    };
  }
}
