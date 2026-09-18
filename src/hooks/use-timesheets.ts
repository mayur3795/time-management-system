import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import {
  createTimesheetEntry,
  deleteTimesheetEntry,
  fetchTimesheetById,
  fetchTimesheets,
  updateTimesheetEntry,
} from '@/services/timesheet.service';
import {
  CreateEntryPayload,
  TimesheetFilters,
  UpdateEntryPayload,
} from '@/types/timesheet';

export function useTimesheets(filters: TimesheetFilters = {}) {
  return useQuery({
    queryKey: queryKeys.timesheets.list(filters),
    queryFn: () => fetchTimesheets(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useTimesheet(id: string) {
  return useQuery({
    queryKey: queryKeys.timesheets.detail(id),
    queryFn: () => fetchTimesheetById(id),
    enabled: Boolean(id),
  });
}

export function useCreateTimesheetEntry(timesheetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEntryPayload) =>
      createTimesheetEntry(timesheetId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheets.detail(timesheetId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheets.all });
    },
  });
}

export function useUpdateTimesheetEntry(timesheetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entryId, payload }: { entryId: string; payload: UpdateEntryPayload }) =>
      updateTimesheetEntry(timesheetId, entryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheets.detail(timesheetId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheets.all });
    },
  });
}

export function useDeleteTimesheetEntry(timesheetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) => deleteTimesheetEntry(timesheetId, entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheets.detail(timesheetId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.timesheets.all });
    },
  });
}
