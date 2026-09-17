import { NextRequest, NextResponse } from 'next/server';
import { TimesheetService } from '@/lib/services/timesheetService';
import { UpdateEntryPayload } from '@/types/timesheet';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; entryId: string }> }
) {
  try {
    const { id, entryId } = await context.params;
    const body: UpdateEntryPayload = await request.json();

    const errors: Record<string, string> = {};
    if (body.projectId !== undefined && !body.projectId.trim()) {
      errors.projectId = 'Project is required.';
    }
    if (body.workType !== undefined && !body.workType.trim()) {
      errors.workType = 'Type of work is required.';
    }
    if (body.description !== undefined && !body.description.trim()) {
      errors.description = 'Task description cannot be empty.';
    }
    if (body.hours !== undefined) {
      const hoursNum = Number(body.hours);
      if (isNaN(hoursNum) || hoursNum <= 0) {
        errors.hours = 'Hours must be greater than 0.';
      } else if (hoursNum > 24) {
        errors.hours = 'Hours cannot exceed 24 hours per entry.';
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', fields: errors },
        { status: 400 }
      );
    }

    const result = await TimesheetService.updateEntry(id, entryId, {
      ...body,
      ...(body.hours !== undefined && { hours: Number(body.hours) }),
    });

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
    const result = await TimesheetService.deleteEntry(id, entryId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/timesheets/[id]/entries/[entryId]:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
