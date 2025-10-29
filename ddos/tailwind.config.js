/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      colors: {
        brand: { 600: "#2563eb", 700: "#1d4ed8" },
        nav: { bg: "#111827", pill: "#1f2937" },
      },
    },
  },
  plugins: [],
};
