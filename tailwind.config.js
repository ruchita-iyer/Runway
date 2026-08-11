/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pace: {
          teal: "var(--pace-teal)",
          gold: "var(--pace-gold)",
          berry: "var(--pace-berry)",
        },
        action: {
          primary: "var(--action-primary)",
        },
        accent: {
          violet: "var(--accent-violet)",
        },
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        slate: "var(--slate)",
        hairline: "var(--hairline)",
        category: {
          1: "var(--category-1)",
          2: "var(--category-2)",
          3: "var(--category-3)",
          4: "var(--category-4)",
          5: "var(--category-5)",
          6: "var(--category-6)",
        },
      },
      borderRadius: {
        lg: "12px",
        xl: "20px",
        "2xl": "24px",
        pill: "999px",
      },
      fontFamily: {
        sans: ["Satoshi", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Outfit", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 28px -10px rgba(66, 38, 20, 0.16)",
        chassis: "0 30px 60px -20px rgba(16, 24, 38, 0.45)",
      },
    },
  },
  plugins: [],
};
