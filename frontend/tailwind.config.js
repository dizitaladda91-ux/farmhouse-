/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          dark: "#0F1715",        // Deep forest slate
          emerald: "#1B3B36",     // Rich emerald
          accent: "#D4AF37",      // Champagne gold
          "accent-hover": "#C59B27",
          bronze: "#8C6D46",      // Luxury bronze
          cream: "#F9F8F3",       // Warm alabaster/pearl background
          card: "#162521",        // Dark card background
          border: "rgba(212, 175, 55, 0.15)",
          muted: "#94A3B8",
        }
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gold-gradient": "linear-gradient(135deg, #DFBA45 0%, #B88E2B 100%)",
        "dark-emerald": "linear-gradient(180deg, #0F1715 0%, #162521 100%)",
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.35)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [],
}
