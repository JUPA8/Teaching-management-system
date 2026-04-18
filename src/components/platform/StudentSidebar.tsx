'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Calendar, HelpCircle } from 'lucide-react';

interface StudentSidebarProps {
  locale: string;
}

export default function StudentSidebar({ locale }: StudentSidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: `/${locale}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${locale}/dashboard/courses`, label: 'My Courses', icon: BookOpen },
    { href: `/${locale}/dashboard/schedule`, label: 'Schedule', icon: Calendar },
    { href: `/${locale}/probestunde`, label: 'Book Trial', icon: HelpCircle },
  ];

  return (
    <aside className="w-60 min-h-full bg-white border-r border-gray-200 shrink-0 hidden md:block">
      <nav className="p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <a
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#2B7A78]/10 text-[#2B7A78]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-[#2B7A78]' : 'text-gray-400'}`} />
              {link.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
