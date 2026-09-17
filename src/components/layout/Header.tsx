'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || 'John Doe';
  const userEmail = session?.user?.email || 'john@example.com';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/timesheets" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-[#0F172A]">
              ticktock
            </span>
          </Link>

          <nav className="flex items-center">
            <Link
              href="/timesheets"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/timesheets')
                  ? 'text-[#0F172A] font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Timesheets
            </Link>
          </nav>
        </div>

        {/* Right: User profile with dropdown & online indicator */}
        <div className="relative" ref={dropdownRef}>
          <Button
            type="button"
            id="userMenuButton"
            variant="ghost"
            aria-label="User profile menu"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-1.5 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 gap-2"
          >
            <span className="font-medium text-slate-800">{userName}</span>
            <ChevronDown
              className={`h-4 w-4 text-slate-500 transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
            {/* Green online dot */}
            <span
              className="inline-block h-2 w-2 rounded-full bg-[#10B981] ring-2 ring-white"
              title="Online"
              aria-hidden="true"
            />
          </Button>

          {/* User dropdown */}
          {dropdownOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in-50 zoom-in-95 duration-100"
            >
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="text-xs font-medium text-slate-600">Signed in as</p>
                <p className="truncate text-sm font-semibold text-slate-900">{userName}</p>
                <p className="truncate text-xs text-slate-600">{userEmail}</p>
              </div>

              <div className="p-1">
                <Button
                  type="button"
                  id="signOutButton"
                  variant="ghost"
                  size="sm"
                  role="menuitem"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full justify-start text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-normal gap-2"
                  leftIcon={<LogOut className="h-4 w-4 shrink-0 text-rose-500" />}
                >
                  <span>Sign out</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
