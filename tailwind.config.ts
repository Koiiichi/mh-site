import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './data/**/*.{md,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface: 'var(--surface)',
        muted: 'var(--muted)',
        foreground: 'var(--text)',
        border: 'var(--border)',
        accent: {
          1: 'var(--acc1)',
          2: 'var(--acc2)'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'monospace'],
        newsreader: ['var(--font-newsreader)', 'Newsreader', 'serif']
      },
      boxShadow: {
        floating: '0 20px 45px rgba(0,0,0,0.28)',
        lift: '0 12px 32px rgba(0,0,0,0.18)'
      },
      borderRadius: {
        xl: '1.5rem'
      },
      transitionTimingFunction: {
        'ambient': 'cubic-bezier(0.33, 1, 0.68, 1)'
      },
      animation: {
        'fade-in': 'fade-in 0.45s ease forwards',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite'
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

export default config;
