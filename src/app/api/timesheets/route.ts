import { NextRequest, NextResponse } from 'next/server';
import { TimesheetStore } from '@/server/timesheet-store';
import { timesheetFilterSchema } from '@/schemas/timesheet.schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = timesheetFilterSchema.safeParse({
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid filter parameters', fields: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await TimesheetStore.getTimesheets(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/timesheets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timesheets. Please try again later.' },
      { status: 500 }
    );
  }
}
