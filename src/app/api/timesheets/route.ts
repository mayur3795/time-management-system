import { NextRequest, NextResponse } from 'next/server';
import { TimesheetService } from '@/lib/services/timesheetService';
import { TimesheetStatus } from '@/types/timesheet';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const status = (searchParams.get('status') as TimesheetStatus | 'ALL') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    const result = await TimesheetService.getTimesheets({
      startDate,
      endDate,
      status,
      page,
      limit,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/timesheets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timesheets. Please try again later.' },
      { status: 500 }
    );
  }
}
