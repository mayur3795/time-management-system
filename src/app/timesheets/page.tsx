import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TimesheetDashboard } from '@/components/timesheets/timesheet-dashboard';

export const metadata = {
  title: 'Your Timesheets | ticktock',
};

export default function TimesheetsDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      <Header />
      <main className="flex-1 py-5 sm:py-8 px-3.5 sm:px-6 lg:px-8">
        <TimesheetDashboard />
      </main>
      <Footer />
    </div>
  );
}
