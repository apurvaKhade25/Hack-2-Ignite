/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#2E8B57',
        teal:      '#3AAFA9',
        purple:    '#7C3AED',
        lavender:  '#D9C7FF',
        mint:      '#CFF7E6',
        navy:      '#0a1628',
        'navy-mid':'#1a2a4a',
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}