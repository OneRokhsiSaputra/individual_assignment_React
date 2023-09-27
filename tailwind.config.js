/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0060e5",
        secondary: "242933",
        dark: {
          100: "#242933",
          200: "#1c2129",
          300: "#363e4c",
        },
        background: "#161a20",
        text: "#cbe1ff",
        light: {
          100: "#f0f2f5",
          200: "#e5e8ee",
          300: "#ccd1d9",
        },
        backgroundDark: "#f8f9fb",
        textDark: "#464d5c",
      },
    },
  },
  plugins: [],
};
