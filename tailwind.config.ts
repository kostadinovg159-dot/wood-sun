import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#faf6f1',
          100: '#f5ede3',
          200: '#e8dcc9',
          300: '#d9c7a8',
          400: '#c9aa7e',
          500: '#b8905f',
          600: '#a67a4f',
          700: '#8a6343',
          800: '#6e513a',
          900: '#5a4330',
        },
        sage: {
          50: '#f8faf7',
          100: '#f1f5ef',
          200: '#dfe6da',
          300: '#c9d5c1',
          400: '#a8bfa0',
          500: '#8fa883',
          600: '#6d8c60',
          700: '#52704a',
          800: '#3f543a',
          900: '#304230',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
