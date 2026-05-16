export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f9f3ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#ddd6fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
        accent: {
          cyan: "#00d9ff",
          violet: "#a78bfa",
          teal: "#14b8a6",
          pink: "#ec4899",
        },
      },
      boxShadow: {
        glow: "0 0 36px rgba(168, 85, 247, 0.3)",
        "glow-lg": "0 0 60px rgba(168, 85, 247, 0.4)",
        "glow-cyan": "0 0 36px rgba(0, 217, 255, 0.25)",
        "glow-pink": "0 0 36px rgba(236, 72, 153, 0.25)",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(168, 85, 247, 0.25), transparent 32%), radial-gradient(circle at bottom right, rgba(0, 217, 255, 0.2), transparent 24%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.95)", opacity: "0.7" },
          "70%": { transform: "scale(1.1)", opacity: "0.2" },
          "100%": { transform: "scale(1.3)", opacity: "0" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1200px 0" },
          "100%": { backgroundPosition: "1200px 0" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        floatSlow: "floatSlow 8s ease-in-out infinite",
        pulseRing: "pulseRing 1.8s ease-out infinite",
        glow: "glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        blob: "blob 7s infinite",
        slideIn: "slideIn 0.6s ease-out",
      },
    },
  },
  plugins: [],
};
