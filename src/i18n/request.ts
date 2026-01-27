import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    // Configure missing translation key warnings
    onError(error) {
      if (error.code === 'MISSING_MESSAGE') {
        // Log warning in development
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Missing translation: ${error.message}`);
        }
      } else {
        // Re-throw other errors
        throw error;
      }
    },
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join('.');

      if (error.code === 'MISSING_MESSAGE') {
        // Return key path as fallback and log warning
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Missing Translation] ${path}`);
        }
        return `[${path}]`;
      }

      return `[Error: ${path}]`;
    },
  };
});
