'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ChevronDown, LogOut, User as UserIcon } from 'lucide-react';

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
          <button
            type="button"
            id="userMenuButton"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <span className="font-medium text-slate-800">{userName}</span>
            <ChevronDown
              className={`h-4 w-4 text-slate-500 transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          
          </button>

          {/* User dropdown */}
          {dropdownOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in-50 zoom-in-95 duration-100"
            >
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="text-xs font-medium text-slate-400">Signed in as</p>
                <p className="truncate text-sm font-semibold text-slate-900">{userName}</p>
                <p className="truncate text-xs text-slate-500">{userEmail}</p>
              </div>

              <div className="p-1">
                <button
                  type="button"
                  id="signOutButton"
                  role="menuitem"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs md:text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
