import React from 'react';

export default function TimesheetsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded-md" />
      <div className="h-16 w-full bg-slate-100 rounded-lg" />
      <div className="min-h-100 w-full bg-slate-100 rounded-xl" />
    </div>
  );
}
