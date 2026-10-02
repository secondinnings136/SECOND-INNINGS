/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Official Brand Color Palette
        'tea-green': '#BDD9BF',
        'charcoal-blue': '#2E4052',
        'golden-pollen': '#FFC857',
        'midnight-violet': '#412234',

        // Semantic Role Bindings
        primary: {
          DEFAULT: '#2E4052', // Charcoal Blue
          hover: '#243342',
          light: '#3D5369',
          dark: '#1C2732',
        },
        secondary: {
          DEFAULT: '#FFC857', // Golden Pollen
          hover: '#EBB442',
          light: '#FFD77F',
          dark: '#D99E22',
        },
        accent: {
          DEFAULT: '#BDD9BF', // Tea Green
          hover: '#A8CCAA',
          light: '#EBF4EC',
          dark: '#8DB890',
        },
        violet: {
          DEFAULT: '#412234', // Midnight Violet
          hover: '#311826',
          light: '#593248',
          dark: '#26121D',
        },
        charcoal: '#2E4052',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
}
