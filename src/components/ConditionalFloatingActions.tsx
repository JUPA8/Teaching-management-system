'use client';

import { usePathname } from 'next/navigation';
import FloatingActions from './FloatingActions';

export default function ConditionalFloatingActions() {
  const pathname = usePathname();
  const isAdminPage = pathname?.includes('/admin');

  if (isAdminPage) {
    return null;
  }

  return <FloatingActions />;
}
