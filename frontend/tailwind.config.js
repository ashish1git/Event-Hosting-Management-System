/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
      colors: {
        charcoal: '#1A1A1B',
        forest: '#2D362E',
        bronze: '#A67C52',
        burgundy: '#4A1C1C',
        parchment: '#BDB5AD',
      }
    },
  },
  plugins: [],
}
