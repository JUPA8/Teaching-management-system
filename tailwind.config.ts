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
        // Warm Traditional Theme - Beige/Cream Background
        cream: {
          50: '#FEFDFB',
          100: '#FAF6F1',  // Primary Background - Warmer beige
          200: '#F5EFE7',  // Surface/Card Color
          300: '#F0E8DD',
          400: '#E8DFD0',
          500: '#E0D6C3',
        },
        // Deep Teal/Emerald - Primary Accent (More saturated)
        primary: {
          50: '#F0F5F4',
          100: '#D9E8E6',
          200: '#B3D1CD',
          300: '#8DBAB4',
          400: '#5A9A91',
          500: '#3B6F5F',  // Main Deep Teal - More saturated
          600: '#2F5F54',  // Darker teal for depth
          700: '#254B43',
          800: '#1C3932',
          900: '#132721',
        },
        // Golden Bronze - Secondary Accent (Richer gold)
        secondary: {
          50: '#FBF8F3',
          100: '#F6EDDC',
          200: '#EDDBBA',
          300: '#E3C897',
          400: '#D4AF6B',  // Richer gold
          500: '#C19A6B',  // Main Golden Bronze - warmer
          600: '#A88456',
          700: '#8E6E45',
          800: '#745834',
          900: '#5A4223',
        },
        // Gold Leaf - Decorative accent
        gold: {
          50: '#FBF8F0',
          100: '#F7EFDB',
          200: '#EEDFB7',
          300: '#E5CF93',
          400: '#DCBF6F',
          500: '#D4AF37',  // Pure gold for decorations
          600: '#C19A2D',
          700: '#A68223',
          800: '#8B6A19',
          900: '#70520F',
        },
        // Text Colors - Warmer tones
        charcoal: {
          DEFAULT: '#2C3E50',  // Deep charcoal for titles
          light: '#6B5D54',    // Warm brown for body text
        },
        // Navy - For trust and professionalism
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
