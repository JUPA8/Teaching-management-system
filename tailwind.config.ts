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
        // Teal - Main color (from Salam Institute logo)
        primary: {
          50: '#f0f9f9',
          100: '#d9efef',
          200: '#b3dfdf',
          300: '#8dcfcf',
          400: '#5fb3b3',
          500: '#3d8a8a',
          600: '#2f7a7a',
          700: '#256565',
          800: '#1c5050',
          900: '#143b3b',
        },
        // Secondary Teal - Darker variant
        secondary: {
          50: '#f0f7f7',
          100: '#d9ebeb',
          200: '#b3d7d7',
          300: '#8dc3c3',
          400: '#5fa3a3',
          500: '#3d7a7a',
          600: '#2f6666',
          700: '#255252',
          800: '#1c3e3e',
          900: '#142a2a',
        },
        // Gold - Accent color (from Salam Institute logo - Arabic text)
        gold: {
          50: '#fdfaf3',
          100: '#faf2de',
          200: '#f5e4bd',
          300: '#efd69c',
          400: '#e5c270',
          500: '#c4a35a',
          600: '#a88945',
          700: '#8c6f35',
          800: '#705525',
          900: '#543b15',
        },
        // Deep Navy - For trust and professionalism
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
          '0%': { boxShadow: '0 0 5px rgb(61 138 138 / 0.5)' },
          '100%': { boxShadow: '0 0 20px rgb(61 138 138 / 0.8)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
