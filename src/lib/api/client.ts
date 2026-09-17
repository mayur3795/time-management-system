import {
  CreateEntryPayload,
  PaginatedTimesheetsResponse,
  Timesheet,
  TimesheetEntry,
  TimesheetFilters,
  UpdateEntryPayload,
} from '@/types/timesheet';
import { Project } from '@/types/project';
import { User } from '@/types/auth';

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.error || 'An unexpected error occurred. Please try again.',
      response.status,
      data.fields
    );
  }

  return data as T;
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url, { method: 'GET' }),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};

// Domain-specific API helpers used by React components

export async function getTimesheets(
  filters: TimesheetFilters = {}
): Promise<PaginatedTimesheetsResponse> {
  const query = new URLSearchParams();
  if (filters.startDate) query.set('startDate', filters.startDate);
  if (filters.endDate) query.set('endDate', filters.endDate);
  if (filters.status && filters.status !== 'ALL') query.set('status', filters.status);
  if (filters.page) query.set('page', filters.page.toString());
  if (filters.limit) query.set('limit', filters.limit.toString());

  const queryString = query.toString();
  const url = `/api/timesheets${queryString ? `?${queryString}` : ''}`;
  return apiClient.get<PaginatedTimesheetsResponse>(url);
}

export async function getTimesheet(id: string): Promise<Timesheet> {
  return apiClient.get<Timesheet>(`/api/timesheets/${id}`);
}

export async function createTimesheetEntry(
  timesheetId: string,
  payload: CreateEntryPayload
): Promise<{ entry: TimesheetEntry; timesheet: Timesheet }> {
  return apiClient.post<{ entry: TimesheetEntry; timesheet: Timesheet }>(
    `/api/timesheets/${timesheetId}/entries`,
    payload
  );
}

export async function updateTimesheetEntry(
  timesheetId: string,
  entryId: string,
  payload: UpdateEntryPayload
): Promise<{ entry: TimesheetEntry; timesheet: Timesheet }> {
  return apiClient.put<{ entry: TimesheetEntry; timesheet: Timesheet }>(
    `/api/timesheets/${timesheetId}/entries/${entryId}`,
    payload
  );
}

export async function deleteTimesheetEntry(
  timesheetId: string,
  entryId: string
): Promise<{ success: boolean; timesheet: Timesheet }> {
  return apiClient.delete<{ success: boolean; timesheet: Timesheet }>(
    `/api/timesheets/${timesheetId}/entries/${entryId}`
  );
}

export async function getProjects(): Promise<Project[]> {
  return apiClient.get<Project[]>('/api/projects');
}

export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>('/api/user');
}
