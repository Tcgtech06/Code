/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22c55e', // Green
          hover: '#16a34a',
        },
        secondary: {
          DEFAULT: '#ef4444', // Red
          hover: '#dc2626',
        },
        accent: {
          DEFAULT: '#eab308', // Yellow
          hover: '#ca8a04',
        }
      },
    },
  },
  plugins: [],
};