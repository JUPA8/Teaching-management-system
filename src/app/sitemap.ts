import { MetadataRoute } from 'next';

const BASE_URL = 'https://salam-institut.com';
const LOCALES = ['en', 'de', 'ar'] as const;

function localizedUrls(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Root redirect → /de (highest priority)
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },

    // Homepage per locale
    ...localizedUrls('', 1.0, 'weekly'),

    // Course pages
    ...localizedUrls('/courses', 0.9, 'weekly'),
    ...localizedUrls('/courses/quran-kids', 0.9, 'weekly'),
    ...localizedUrls('/courses/quran-adults', 0.9, 'weekly'),
    ...localizedUrls('/courses/arabic', 0.9, 'weekly'),
    ...localizedUrls('/courses/islamic-studies', 0.9, 'weekly'),

    // Teachers
    ...localizedUrls('/teachers', 0.8, 'weekly'),

    // Videos
    ...localizedUrls('/videos', 0.7, 'weekly'),

    // News
    ...localizedUrls('/news', 0.8, 'daily'),

    // Pricing
    ...localizedUrls('/pricing', 0.8, 'monthly'),

    // Probestunde (trial)
    ...localizedUrls('/probestunde', 0.8, 'monthly'),

    // About / Contact / FAQ
    ...localizedUrls('/about', 0.6, 'monthly'),
    ...localizedUrls('/contact', 0.6, 'monthly'),
    ...localizedUrls('/faq', 0.6, 'monthly'),

    // Legal
    ...localizedUrls('/privacy', 0.3, 'yearly'),
    ...localizedUrls('/terms', 0.3, 'yearly'),
    ...localizedUrls('/imprint', 0.3, 'yearly'),
  ];
}
