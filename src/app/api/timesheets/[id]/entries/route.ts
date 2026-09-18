import { NextRequest, NextResponse } from 'next/server';
import { TimesheetStore } from '@/server/timesheet-store';
import { createEntrySchema } from '@/schemas/timesheet-entry.schema';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const parsed = createEntrySchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        const path = err.path.join('.');
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = err.message;
        }
      });

      return NextResponse.json(
        { error: 'Validation failed', fields: fieldErrors },
        { status: 400 }
      );
    }

    const result = await TimesheetStore.addEntry(id, parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/timesheets/[id]/entries:', error);
    const message = error instanceof Error ? error.message : 'Failed to create entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
