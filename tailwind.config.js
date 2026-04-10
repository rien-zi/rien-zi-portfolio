export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        logo: ['"Annie Use Your Telescope"', 'cursive'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        // NEW
        accent: ['"Dosis"', 'sans-serif'],
      },
      colors: {
        darkbg: '#0F1010',
      },
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(12deg)" },
          "40%": { transform: "rotate(-8deg)" },
          "60%": { transform: "rotate(12deg)" },
          "80%": { transform: "rotate(-4deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        wave: "wave 0.6s ease-in-out",
      },
    },
  },
  plugins: [],
}
