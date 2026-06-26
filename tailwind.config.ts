import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sage: {
          bg: '#0A0A0B',
          surface: '#111113',
          elevated: '#1A1A1E',
          border: 'rgba(255,255,255,0.05)',
        },
        gold: {
          50:  '#FBF5E6',
          100: '#F7EAC8',
          200: '#F0D488',
          300: '#F0CC6E',
          400: '#E8B94A',
          500: '#C9A84C',
          600: '#A88930',
          700: '#8B6914',
          800: '#5C4409',
          900: '#2E2204',
          muted: 'rgba(201,168,76,0.15)',
          border: 'rgba(201,168,76,0.2)',
          glow: 'rgba(201,168,76,0.35)',
        },
        cream: {
          DEFAULT: '#E8E0D0',
          muted: '#9A8F7E',
          faint: '#5A5248',
        },
        blunder: '#E05252',
        mistake: '#E07A52',
        inaccuracy: '#D4BC44',
        good: '#52B788',
        brilliant: '#4E9EE8',
      },
      fontFamily: {
        display: ['var(--font-cinzel)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #F0CC6E 50%, #C9A84C 100%)',
        'gold-radial': 'radial-gradient(ellipse at center, rgba(201,168,76,0.15) 0%, transparent 70%)',
        'surface-gradient': 'linear-gradient(180deg, #1A1A1E 0%, #111113 100%)',
      },
      boxShadow: {
        gold: '0 0 20px rgba(201,168,76,0.25)',
        'gold-sm': '0 0 8px rgba(201,168,76,0.15)',
        'gold-lg': '0 0 40px rgba(201,168,76,0.3)',
        glass: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0)' },
          '50%': { boxShadow: '0 0 12px 4px rgba(201,168,76,0.25)' },
        },
        'slide-up': {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backdropBlur: { glass: '12px' },
    },
  },
  plugins: [],
};

export default config;
