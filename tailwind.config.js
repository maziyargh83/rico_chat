/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        body: "var(--color-body)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        primary: "var(--color-primary)",
        light: "var(--color-light)",
        reverse: "var(--color-reverse)",
        border: "var(--color-border)",
      },
      backgroundColor: (theme) => ({
        ...theme("colors"),
      }),
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("optional", "&:optional");
      addVariant("hocus", ["&:hover", "&:focus"]);
      addVariant("inverted-colors", "@media (inverted-colors: inverted)");
    }),
  ],
};
