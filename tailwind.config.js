/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'att-blue': {
          DEFAULT: '#067AB4',
          light: '#3AA5DC',
        },
        'att-orange': '#FF7200',
        'att-gray': '#4a4a4a',
        'att-light-gray': '#f5f5f5',
      },
      fontFamily: {
        sans: ['"Product Sans"', '"Google Sans"', 'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fadeIn 0.4s',
        'fade-out': 'fadeOut 0.4s',
        'slide-in': 'slideIn 0.3s ease',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        'slide-up': {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        'fadeIn': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'fadeOut': {
          'from': { opacity: '1' },
          'to': { opacity: '0' },
        },
        'slideIn': {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 