/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["**/*.tsx"],
  theme: {
    extend: {
      gridTemplateColumns: {
        "app-shell": "max-content auto",
      },
      gridTemplateRows: {
        "app-shell": "max-content auto",
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
