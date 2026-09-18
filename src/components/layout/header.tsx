'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logoutUser } from '@/services/auth.service';

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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/timesheets" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded">
            <span className="text-xl font-bold tracking-tight text-[#0F172A]">
              ticktock
            </span>
          </Link>

          <nav className="flex items-center">
            <Link
              href="/timesheets"
              className={`text-sm font-medium transition-colors py-1 px-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                pathname.startsWith('/timesheets')
                  ? 'text-[#0F172A] font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Timesheets
            </Link>
          </nav>
        </div>

        <div className="relative" ref={dropdownRef}>
          <Button
            type="button"
            id="userMenuButton"
            variant="ghost"
            aria-label="User profile menu"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-1.5 sm:px-2.5 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 gap-1.5 sm:gap-2 min-h-[40px]"
          >
            <span className="font-medium text-slate-800 truncate max-w-[85px] xs:max-w-[130px] sm:max-w-[180px] md:max-w-none">
              {userName}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-slate-500 shrink-0 transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>

          {dropdownOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              className="absolute right-0 mt-2 w-52 sm:w-56 max-w-[calc(100vw-1.5rem)] origin-top-right rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in-50 zoom-in-95 duration-100"
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
                  onClick={() => logoutUser('/login')}
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
