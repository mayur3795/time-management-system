export type TimesheetStatus = 'COMPLETED' | 'INCOMPLETE' | 'MISSING';

export type WorkType =
  | 'Bug fixes'
  | 'Feature Development'
  | 'Code Review'
  | 'Testing'
  | 'Meeting'
  | 'Research'
  | 'Other';

export interface TimesheetEntry {
  id: string;
  timesheetId: string;
  date: string;
  projectId: string;
  projectName: string;
  workType: WorkType;
  description: string;
  hours: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Timesheet {
  id: string;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  totalHours: number;
  status: TimesheetStatus;
  entries: TimesheetEntry[];
}

export interface TimesheetFilters {
  startDate?: string;
  endDate?: string;
  status?: TimesheetStatus | 'ALL';
  page?: number;
  limit?: number;
}

export interface PaginatedTimesheetsResponse {
  timesheets: Timesheet[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateEntryPayload {
  date: string;
  projectId: string;
  workType: WorkType;
  description: string;
  hours: number;
}

export interface UpdateEntryPayload {
  date?: string;
  projectId?: string;
  workType?: WorkType;
  description?: string;
  hours?: number;
}
