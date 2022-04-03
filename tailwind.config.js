const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontSize: {
      xs: [".5rem", ".7rem"],
      sm: [".75rem", "1rem"],
      xl: ["1.5rem", "2rem"],
      xxl: ["4rem", "4rem"],
      xxxxl: ["6rem", "6rem"]
    },
    colors: {
      gray: colors.coolGray,
      green: colors.green,
      red: colors.rose,
      black: colors.warmGray
    },
    fontFamily: {
      header: ["Staatliches"],
      body: ["Lato", "sans-serif"]
    },
    extend: {}
  },
  variants: {
    extend: {
      opacity: ["disabled"]
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
