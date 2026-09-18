import { z } from 'zod';

export const timesheetFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['ALL', 'COMPLETED', 'INCOMPLETE', 'MISSING']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(5),
});

export type TimesheetFilterInput = z.infer<typeof timesheetFilterSchema>;
