import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ticktock - Timesheet Management SaaS',
  description:
    'Effortlessly track and monitor employee attendance and productivity from anywhere, anytime.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans h-full`}>
      <body className="min-h-full flex flex-col bg-[#F8F9FA] text-[#1E293B] antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
