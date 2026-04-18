'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Users, Calendar } from 'lucide-react';

interface TeacherSidebarProps {
  locale: string;
}

export default function TeacherSidebar({ locale }: TeacherSidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: `/${locale}/teacher`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${locale}/teacher/courses`, label: 'My Courses', icon: BookOpen },
    { href: `/${locale}/teacher/students`, label: 'My Students', icon: Users },
    { href: `/${locale}/teacher/schedule`, label: 'Schedule', icon: Calendar },
  ];

  return (
    <aside className="w-60 min-h-full bg-white border-r border-gray-200 shrink-0 hidden md:block">
      <nav className="p-4 space-y-1">
        {links.map((link) => {
          const isActive =
            link.href === `/${locale}/teacher`
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <a
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {link.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
