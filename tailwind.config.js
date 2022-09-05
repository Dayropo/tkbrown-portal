/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: "Playfair Display, serif",
        hind: "Hind, sans-serif",
        poppins: "Poppins, sans-serif",
        oswald: "Oswald, sans-serif",
        parisienne: "Parisienne, cursive",
      },
      colors: {
        blu: "#4996f3",
      },
    },
  },
  variants: {
    backgroundColor: ({ after }) => after(["disabled"]),
    opacity: ({ after }) => after(["disabled"]),
  },
  plugins: [],
}
