import { NextRequest, NextResponse } from 'next/server';
import { TimesheetService } from '@/lib/services/timesheetService';
import { CreateEntryPayload } from '@/types/timesheet';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body: CreateEntryPayload = await request.json();

    // Validation
    const errors: Record<string, string> = {};
    if (!body.projectId || !body.projectId.trim()) {
      errors.projectId = 'Project is required.';
    }
    if (!body.workType || !body.workType.trim()) {
      errors.workType = 'Type of work is required.';
    }
    if (!body.description || !body.description.trim()) {
      errors.description = 'Task description is required.';
    }
    const hoursNum = Number(body.hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      errors.hours = 'Hours must be greater than 0.';
    } else if (hoursNum > 24) {
      errors.hours = 'Hours cannot exceed 24 hours per entry.';
    }
    if (!body.date) {
      errors.date = 'Date is required.';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', fields: errors },
        { status: 400 }
      );
    }

    const result = await TimesheetService.addEntry(id, {
      date: body.date,
      projectId: body.projectId,
      workType: body.workType,
      description: body.description.trim(),
      hours: hoursNum,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/timesheets/[id]/entries:', error);
    const message = error instanceof Error ? error.message : 'Failed to create entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
