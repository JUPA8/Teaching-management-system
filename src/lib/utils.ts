import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function isRTL(locale: string): boolean {
  return locale === 'ar';
}

/**
 * Convert Western Arabic numerals to Eastern Arabic numerals
 * Used when displaying numbers in Arabic locale
 */
export function toArabicNumerals(input: string | number): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(input).replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
}

/**
 * Format a number for display based on locale
 * Converts to Arabic numerals if locale is 'ar'
 */
export function formatNumberForLocale(input: string | number, locale: string): string {
  if (locale === 'ar') {
    return toArabicNumerals(input);
  }
  return String(input);
}
