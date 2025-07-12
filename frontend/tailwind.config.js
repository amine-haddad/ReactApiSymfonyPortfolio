/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <== active dark mode avec la classe .dark
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        bgColor: "var(--secondary-color)",
        bgColorHover: "var(--background-color-hover)",
        bgColorTrans: "var(--background-color-trans)",
        textColor: "var(--text-color)",
        accentColor: "var(--accent-color)",
        buttonBg: "var(--button-bg)",
        buttonBgHover: "var(--button-bg-hover)",
        navbarBg: "var(--navbar-bg)",
        navbarText: "var(--navbar-text)",
        accent: "var(--accent-color)",
        buttonHover: "var(--button-bg-hover)",
        borderColor: "var(--border-color)",
        primaryColor: "var(--primary-color)",
        primaryColorHover: "var(--primary-color-hover)",
        secondaryColor: "var(--secondary-color)",
      },

      backgroundImage: {
        "gradient-custom":
          "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
      },

      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        fadeIn: "fadeIn 0.5s ease",
      },

      boxShadow: {
        custom: "var(--box-shadow)",
      },

      fontFamily: {
        urbanist: ['"Urbanist"', "sans-serif"],
        title: ['"Irish Grover"', "sans-serif"],
      },

      spacing: {
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
        11: "2.75rem",
        12: "3rem",
        13: "3.25rem",
        14: "3.5rem",
        15: "3.75rem",
        16: "4rem",
        17: "4.25rem",
        18: "4.5rem",
        19: "4.75rem",
        20: "5rem",
        21: "5.25rem",
        22: "5.5rem",
        23: "5.75rem",
        24: "6rem",
        25: "6.25rem",
        26: "6.5rem",
        27: "6.75rem",
        28: "7rem",
        29: "7.25rem",
        30: "7.5rem",
        72: "18rem",
        80: "20rem",
        88: "22rem",
        96: "24rem",
        100: "25rem",
        120: "30rem",
        160: "40rem",
        200: "50rem",
        "1/2": "50%",
        "1/3": "33.3333%",
        "2/3": "66.6667%",
        "1/4": "25%",
        "3/4": "75%",
      },

      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
        "7xl": "5rem",
      },

      screens: {
        xs: "360px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },

      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        10: "10",
        100: "100",
        999: "999",
        max: "9999",
      },

      transitionDuration: {
        75: "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        700: "700ms",
        1000: "1000ms",
      },
    },
  },
  plugins: [],
};
