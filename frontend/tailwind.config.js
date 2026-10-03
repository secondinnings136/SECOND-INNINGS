/** @type {import('tailwindcss').Config} */

// Editorial Paper palette. See /DESIGN.md.
const paper = '#F4F2EC';
const paper2 = '#EBE7DE';
const paper3 = '#E0DBCF';
const ink = '#1C1B18';
const ink2 = '#3B3934';
const muted = '#6F6B62';
const signal = '#B0442C';
const signalSoft = '#F1E1D9';

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: paper, 2: paper2, 3: paper3 },
        ink: { DEFAULT: ink, 2: ink2 },
        muted,
        line: 'rgba(28, 27, 24, 0.12)',
        signal: { DEFAULT: signal, soft: signalSoft, deep: '#8E3522' },

        // Legacy names remapped so untouched screens (admin) adopt the new palette.
        'charcoal-blue': ink,
        'golden-pollen': signal,
        'tea-green': paper3,
        'midnight-violet': ink2,
        charcoal: ink,
        primary: { DEFAULT: ink, hover: '#2E2C28', light: ink2, dark: '#111110' },
        secondary: { DEFAULT: signal, hover: '#9A3A25', light: '#C9654C', dark: '#8E3522' },
        accent: { DEFAULT: paper3, hover: '#D6D0C2', light: paper2, dark: '#C9C2B2' },
        violet: { DEFAULT: ink2, hover: ink, light: muted, dark: '#111110' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      maxWidth: {
        page: '84rem',
      },
      zIndex: {
        nav: '40',
        overlay: '45',
        grain: '50',
        intro: '60',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(4%, -3%, 0) scale(1.08)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        drift: 'drift 28s cubic-bezier(0.45, 0, 0.55, 1) infinite',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};
