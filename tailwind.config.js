/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './app/**/*.{js,ts,tsx}',
    './components/ui/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
      extend: {
        colors: {
          primary: '#FF6A00',
          secondary: '#E9BB02',
          background: '#FFFFFF',
          card: '#FFFFFF',
        },
      },
    plugins: [],
  },
};