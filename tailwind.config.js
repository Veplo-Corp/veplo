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
      fontFamily: {
        sans: ['var(--font-work-sans)'],
        mono: ['var(--font-roboto-mono)'],
      },
    },
  },
  plugins: [],
}
