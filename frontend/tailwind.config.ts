import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe8ff',
          200: '#c4d9ff',
          300: '#9fbfff',
          400: '#7da4ff',
          500: '#5a88ff',
          600: '#2f68ff',
          700: '#2554d4',
        },
      },
    },
  },
  plugins: [],
};

export default config;
