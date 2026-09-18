import { WorkType } from '@/types/timesheet';

export const WORK_TYPES: readonly WorkType[] = [
  'Bug fixes',
  'Feature Development',
  'Code Review',
  'Testing',
  'Meeting',
  'Research',
  'Other',
] as const;
