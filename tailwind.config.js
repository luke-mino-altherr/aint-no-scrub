const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontSize: {
      xs: ['.5rem', '.7rem'],
      sm: ['.75rem', '1rem'],
      xl: ['1.5rem', '2rem']
    },
    colors: {
      gray: colors.coolGray,
      black: colors.warmGray
    },
    fontFamily: {
      header: ['Mukta', 'sans-serif'],
      body: ['Lato', 'sans-serif'],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
