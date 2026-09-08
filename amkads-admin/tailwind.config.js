/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black:       '#0D0D0D',
          white:       '#FFFFFF',
          orange:      '#F5821F',
          orangeHover: '#D9701A',
          greyLight:   '#F7F7F8',
          greyDark:    '#B3B3B3',
          greyMedium:  '#4D4D4D',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter:  ['Inter',  'sans-serif'],
      },
    },
  },
  plugins: [],
}
