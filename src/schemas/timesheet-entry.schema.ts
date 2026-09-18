import { z } from 'zod';
import { WorkType } from '@/types/timesheet';

export const WORK_TYPE_VALUES = [
  'Bug fixes',
  'Feature Development',
  'Code Review',
  'Testing',
  'Meeting',
  'Research',
  'Other',
] as const satisfies readonly WorkType[];

export const createEntrySchema = z.object({
  projectId: z
    .string()
    .trim()
    .min(1, 'Please select a project.'),
  workType: z.enum(WORK_TYPE_VALUES, {
    message: 'Please select a type of work.',
  }),
  description: z
    .string()
    .trim()
    .min(1, 'Please provide a task description.'),
  hours: z
    .number({ message: 'Hours must be a number.' })
    .min(0.5, 'Hours must be at least 0.5 hours.')
    .max(40, 'Hours cannot exceed 40 hours.'),
  date: z
    .string()
    .trim()
    .min(1, 'Date is required.'),
});

export const updateEntrySchema = z.object({
  projectId: z
    .string()
    .trim()
    .min(1, 'Project is required.')
    .optional(),
  workType: z
    .enum(WORK_TYPE_VALUES, {
      message: 'Type of work is required.',
    })
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, 'Task description cannot be empty.')
    .optional(),
  hours: z
    .number({ message: 'Hours must be a number.' })
    .min(0.5, 'Hours must be at least 0.5 hours.')
    .max(40, 'Hours cannot exceed 40 hours.')
    .optional(),
  date: z
    .string()
    .trim()
    .min(1, 'Date cannot be empty.')
    .optional(),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
