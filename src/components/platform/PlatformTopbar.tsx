'use client';

import { signOut } from 'next-auth/react';
import { BookOpen, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface PlatformTopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
  locale: string;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrator',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  TEACHER: 'bg-blue-100 text-blue-700',
  STUDENT: 'bg-green-100 text-green-700',
};

export default function PlatformTopbar({ user, locale }: PlatformTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const role = user.role ?? 'STUDENT';
  const firstName = user.name?.split(' ')[0] ?? 'User';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
      {/* Logo */}
      <a href={`/${locale}`} className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-[#2B7A78] to-[#D9B574] rounded-lg flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900 hidden sm:block">Salam Institute</span>
      </a>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#2B7A78] to-[#D9B574] rounded-full flex items-center justify-center text-white font-bold text-sm">
            {firstName[0]?.toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-900">{firstName}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLORS[role]}`}>
              {ROLE_LABELS[role] ?? role}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
