/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neoYellow: '#FFD700',
        neoBlue: '#bae6fd', // light blue/sky-200 for headers
        neoRed: '#ef4444',
        neoBg: '#F9F9F9',
      },
      boxShadow: {
        neo: '4px 4px 0px 0px rgba(0,0,0,1)',
        neoActive: '2px 2px 0px 0px rgba(0,0,0,1)',
      }
    },
  },
  plugins: [],
}
