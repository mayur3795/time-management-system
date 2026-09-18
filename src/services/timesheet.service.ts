import { apiClient } from '@/lib/api/axios';
import {
  CreateEntryPayload,
  PaginatedTimesheetsResponse,
  Timesheet,
  TimesheetEntry,
  TimesheetFilters,
  UpdateEntryPayload,
} from '@/types/timesheet';

export async function getTimesheets(
  filters: TimesheetFilters = {}
): Promise<PaginatedTimesheetsResponse> {
  const params = new URLSearchParams();
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);
  if (filters.status && filters.status !== 'ALL') params.set('status', filters.status);
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());

  const query = params.toString();
  return apiClient.get<PaginatedTimesheetsResponse>(`/api/timesheets${query ? `?${query}` : ''}`);
}

export async function getTimesheetById(id: string): Promise<Timesheet> {
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
