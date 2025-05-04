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
      },
      colors: {
        darkbg: '#0F1010',
      },
    },
  },
  plugins: [],
}
