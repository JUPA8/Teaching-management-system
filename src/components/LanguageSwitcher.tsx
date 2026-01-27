'use client';

import { useState, useTransition } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter, type Locale, locales, localeNames, localeFlags } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const currentLocale = locale as Locale;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-50',
          isPending && 'opacity-50 cursor-wait'
        )}
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">{localeFlags[currentLocale]}</span>
        <ChevronDown
          className={cn('w-3 h-3 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute end-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg py-1 z-20 animate-scale-in border">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                disabled={loc === currentLocale}
                className={cn(
                  'w-full px-4 py-2.5 text-start text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3',
                  loc === currentLocale && 'bg-primary-50 text-primary-600'
                )}
              >
                <span className="text-lg">{localeFlags[loc]}</span>
                <span className="flex-1">{localeNames[loc]}</span>
                {loc === currentLocale && (
                  <Check className="w-4 h-4 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
