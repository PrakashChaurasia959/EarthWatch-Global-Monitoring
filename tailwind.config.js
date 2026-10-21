/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep navy / space-inspired palette
        space: {
          950: '#05070f',
          900: '#0a0e1a',
          850: '#0d1220',
          800: '#111827',
          750: '#161f33',
          700: '#1c2740',
          600: '#243456',
          500: '#36507d',
        },
        accent: {
          cyan: '#22d3ee',
          teal: '#2dd4bf',
          amber: '#f59e0b',
          rose: '#fb7185',
          violet: '#a78bfa',
          green: '#34d399',
          blue: '#60a5fa',
        },
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans Devanagari"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.18), 0 8px 30px -8px rgba(34,211,238,0.25)',
        'glow-amber': '0 0 0 1px rgba(245,158,11,0.18), 0 8px 30px -8px rgba(245,158,11,0.25)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 10px 30px -12px rgba(0,0,0,0.7)',
      },
      backgroundImage: {
        'space-radial':
          'radial-gradient(1200px 600px at 80% -10%, rgba(96,165,250,0.10), transparent), radial-gradient(900px 500px at -10% 10%, rgba(167,139,250,0.10), transparent)',
        'grid-fade':
          'linear-gradient(180deg, rgba(10,14,26,0) 0%, rgba(10,14,26,0.6) 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out both',
        'slide-in': 'slide-in 0.3s ease-out both',
        'pulse-soft': 'pulse-soft 2.2s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
