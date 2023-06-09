/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'min-0': { min: '0px' },
        'min-380': { min: '380px' },
      },
    },
  },
  plugins: [],
}
