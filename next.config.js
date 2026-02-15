const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow production builds even with type errors (temporary for deployment)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow production builds even with ESLint errors  
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = withNextIntl(nextConfig);
