/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--tw-primary)",
        "background-light": "var(--tw-bg-light)",
        "background-dark": "var(--tw-bg-dark)",
        "teal-surface": "var(--tw-teal-surface)",
        "teal-accent": "var(--tw-teal-accent)",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
}
