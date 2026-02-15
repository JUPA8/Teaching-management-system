import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colors extracted from Salam Institute Logo
        cream: {
          50: '#FEFDFB',
          100: '#FAF6F1',  // Primary Background - matches logo background
          200: '#F5EFE7',  // Surface/Card Color
          300: '#F0E8DD',
          400: '#E8DFD0',
          500: '#E0D6C3',
        },
        // Deep Teal - From Logo Islamic Arch (exact match)
        primary: {
          50: '#E8F3F2',
          100: '#D1E7E5',
          200: '#A3CFCB',
          300: '#75B7B1',
          400: '#479F97',
          500: '#2B7A78',  // EXACT match from logo arch
          600: '#236260',  // Darker shade
          700: '#1A4948',
          800: '#123130',
          900: '#091918',
        },
        // Golden Bronze - From Logo Arabic Text (exact match)
        secondary: {
          50: '#FBF8F3',
          100: '#F6EDDC',
          200: '#EDDBBA',
          300: '#E3C897',
          400: '#D9B574',  // EXACT match from logo text
          500: '#C9A551',  // Main golden
          600: '#B18C41',
          700: '#997431',
          800: '#805C21',
          900: '#684411',
        },
        // Gold accent - From logo highlights
        gold: {
          50: '#FBF8F0',
          100: '#F7EFDB',
          200: '#EEDFB7',
          300: '#E5CF93',
          400: '#DCBF6F',
          500: '#D9B574',  // Matches secondary-400 for consistency
          600: '#C9A551',
          700: '#B18C41',
          800: '#997431',
          900: '#805C21',
        },
        // Text Colors
        charcoal: {
          DEFAULT: '#2C3E50',
          light: '#6B5D54',
        },
        // Navy - For trust
        navy: {
          50: '#f5f7fa',
          100: '#e4e9f0',
          200: '#c9d3e1',
          300: '#aebdd2',
          400: '#93a7c3',
          500: '#7891b4',
          600: '#5d7ba5',
          700: '#4a6590',
          800: '#374f7b',
          900: '#243966',
        },
      },
      fontFamily: {
        arabic: ['Amiri', 'Noto Naskh Arabic', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        quran: ['Scheherazade New', 'Amiri', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'islamic-pattern': "url('/patterns/islamic.svg')",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-teal': 'glow-teal 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(177, 140, 93, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(177, 140, 93, 0.5)' },
        },
        'glow-teal': {
          '0%': { boxShadow: '0 0 15px rgba(61, 107, 101, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(61, 107, 101, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
