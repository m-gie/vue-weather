/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      Roboto: ['Roboto, sans-serif']
    },
    container: {
      padding: '2rem',
      center: true
    },
    extend: {
      colors: {
        'weather-primary': '#00668A',
        'weather-secondary': '#004E71'
      }
    }
  },
  plugins: []
}
