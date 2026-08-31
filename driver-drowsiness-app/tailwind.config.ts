import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        alert: {
          low: '#16a34a',
          medium: '#eab308',
          high: '#dc2626',
        },
      },
    },
  },
  plugins: [],
};

export default config;
