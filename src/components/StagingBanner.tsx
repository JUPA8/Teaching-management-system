'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, AlertTriangle } from 'lucide-react';

export default function StagingBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const t = useTranslations('staging');
  const isStaging = process.env.NEXT_PUBLIC_APP_ENV === 'staging';

  if (!isStaging || !isVisible) return null;

  return (
    <div className="bg-amber-500 text-amber-900 px-4 py-3 relative">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium text-center">
          <span className="font-bold">{t('banner')}</span> - {t('message')}
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-amber-600 rounded transition-colors"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
