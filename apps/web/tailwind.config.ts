import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#171717',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#171717',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#171717',
        },
        primary: {
          DEFAULT: '#8b5a3c',
          foreground: '#fafafa',
        },
        secondary: {
          DEFAULT: '#f5f5f5',
          foreground: '#262626',
        },
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#737373',
        },
        accent: {
          DEFAULT: '#f5f5f5',
          foreground: '#262626',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#fafafa',
        },
        border: '#e5e5e5',
        input: '#e5e5e5',
        ring: '#a3a3a3',
        'chart-1': '#0d9488',
        'chart-2': '#f97316',
        'chart-3': '#3b82f6',
        'chart-4': '#eab308',
        'chart-5': '#f59e0b',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};

export default config;
