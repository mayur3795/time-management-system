import React from 'react';
import { TimesheetDetailView } from '@/components/timesheets/timesheet-detail-view';

export const metadata = {
  title: 'Timesheet Details | ticktock',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TimesheetDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <TimesheetDetailView id={resolvedParams.id} />;
}
