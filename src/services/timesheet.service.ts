import { apiClient } from '@/lib/api/axios-client';
import {
  CreateEntryPayload,
  PaginatedTimesheetsResponse,
  Timesheet,
  TimesheetEntry,
  TimesheetFilters,
  UpdateEntryPayload,
} from '@/types/timesheet';

export async function fetchTimesheets(
  filters: TimesheetFilters = {}
): Promise<PaginatedTimesheetsResponse> {
  const params = new URLSearchParams();
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);
  if (filters.status && filters.status !== 'ALL') params.set('status', filters.status);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  const query = params.toString();
  const response = await apiClient.get<PaginatedTimesheetsResponse>(
    `/api/timesheets${query ? `?${query}` : ''}`
  );
  return response.data;
}

export async function fetchTimesheetById(id: string): Promise<Timesheet> {
  const response = await apiClient.get<Timesheet>(`/api/timesheets/${id}`);
  return response.data;
}

export async function createTimesheetEntry(
  timesheetId: string,
  payload: CreateEntryPayload
): Promise<{ entry: TimesheetEntry; timesheet: Timesheet }> {
  const response = await apiClient.post<{ entry: TimesheetEntry; timesheet: Timesheet }>(
    `/api/timesheets/${timesheetId}/entries`,
    payload
  );
  return response.data;
}

export async function updateTimesheetEntry(
  timesheetId: string,
  entryId: string,
  payload: UpdateEntryPayload
): Promise<{ entry: TimesheetEntry; timesheet: Timesheet }> {
  const response = await apiClient.put<{ entry: TimesheetEntry; timesheet: Timesheet }>(
    `/api/timesheets/${timesheetId}/entries/${entryId}`,
    payload
  );
  return response.data;
}

export async function deleteTimesheetEntry(
  timesheetId: string,
  entryId: string
): Promise<{ success: boolean; timesheet: Timesheet }> {
  const response = await apiClient.delete<{ success: boolean; timesheet: Timesheet }>(
    `/api/timesheets/${timesheetId}/entries/${entryId}`
  );
  return response.data;
}
