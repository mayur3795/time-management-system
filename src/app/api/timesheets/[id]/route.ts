import { NextRequest, NextResponse } from 'next/server';
import { TimesheetService } from '@/lib/services/timesheetService';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const timesheet = await TimesheetService.getTimesheetById(id);

    if (!timesheet) {
      return NextResponse.json(
        { error: `Timesheet with ID ${id} was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(timesheet, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/timesheets/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve timesheet.' },
      { status: 500 }
    );
  }
}
