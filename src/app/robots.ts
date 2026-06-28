import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://salam-institut.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/en/admin/',
          '/de/admin/',
          '/ar/admin/',
          '/en/dashboard/',
          '/de/dashboard/',
          '/ar/dashboard/',
          '/en/teacher/',
          '/de/teacher/',
          '/ar/teacher/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
