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
        // Light Academic Theme - Cream Background
        cream: {
          50: '#FEFCF9',
          100: '#FDF8F1',  // Primary Background
          200: '#F9F3EA',  // Surface/Card Color
          300: '#F5EDE0',
          400: '#EDE3D3',
          500: '#E5D9C6',
        },
        // Forest Teal - Primary Accent
        primary: {
          50: '#F0F5F4',
          100: '#D9E8E6',
          200: '#B3D1CD',
          300: '#8DBAB4',
          400: '#5A9A91',
          500: '#4A8079',
          600: '#3D6B65',  // Main Forest Teal
          700: '#325954',
          800: '#274743',
          900: '#1C3532',
        },
        // Golden Bronze - Secondary Accent
        secondary: {
          50: '#FBF7F1',
          100: '#F5EBDB',
          200: '#EBD7B7',
          300: '#DFC393',
          400: '#CFAB74',
          500: '#B18C5D',  // Main Golden Bronze
          600: '#9A7A4F',
          700: '#836841',
          800: '#6C5633',
          900: '#554425',
        },
        // Gold - Accent color (keeping for compatibility)
        gold: {
          50: '#FBF7F1',
          100: '#F5EBDB',
          200: '#EBD7B7',
          300: '#DFC393',
          400: '#CFAB74',
          500: '#B18C5D',
          600: '#9A7A4F',
          700: '#836841',
          800: '#6C5633',
          900: '#554425',
        },
        // Text Colors
        charcoal: {
          DEFAULT: '#433E37',  // Deep Charcoal-Brown for titles
          light: '#6B645C',    // Muted Grey-Brown for body
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
