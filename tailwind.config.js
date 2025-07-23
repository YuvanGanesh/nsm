/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16a34a', // Tailwind green-600
          light: '#22c55e',   // Tailwind green-500
          dark: '#166534',    // Tailwind green-800
        },
      },
    },
  },
  plugins: [],
};
