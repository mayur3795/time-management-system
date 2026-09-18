import { NextRequest, NextResponse } from 'next/server';
import { TimesheetStore } from '@/server/timesheet-store';
import { updateEntrySchema } from '@/schemas/timesheet-entry.schema';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; entryId: string }> }
) {
  try {
    const { id, entryId } = await context.params;
    const body = await request.json();

    const parsed = updateEntrySchema.safeParse(body);
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

    const result = await TimesheetStore.updateEntry(id, entryId, parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/timesheets/[id]/entries/[entryId]:', error);
    const message = error instanceof Error ? error.message : 'Failed to update entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; entryId: string }> }
) {
  try {
    const { id, entryId } = await context.params;
    const result = await TimesheetStore.deleteEntry(id, entryId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/timesheets/[id]/entries/[entryId]:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
