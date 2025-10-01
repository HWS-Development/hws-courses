/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
  extend: {
  colors: {
  brand: {
  orange: '#FF6B00', // أساسي من الشعار
  orangeLight: '#FF8C33', // hover
  blue: '#0066FF', // ثانوي/روابط
  blueLight: '#3B82F6', // hover للروابط
  }
  },
  boxShadow: {
  soft:'0 8px 24px rgba(0,0,0,.08)'
  }
  },
  },
  plugins: [],
  }