import { TimesheetFilters } from '@/types/timesheet';

export const queryKeys = {
  timesheets: {
    all: ['timesheets'] as const,
    list: (filters: TimesheetFilters = {}) => ['timesheets', 'list', filters] as const,
    detail: (id: string) => ['timesheets', 'detail', id] as const,
  },
  projects: {
    all: ['projects'] as const,
  },
  user: {
    current: ['user', 'current'] as const,
  },
};
