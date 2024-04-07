/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0bbe35",
        slate1: "#1a1e27",
        slate2: "#15181f",
        slate3: "#181d26",
        slate4: "#242831",
      },
      borderColor: {
        primary: "#0bbe35",
      },
    },
  },
  plugins: [],
};
