/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "bg": "#121118",
        "primary": "#666FBF",
        "secondary": "#00C2AB",
        "secondaryDark": "#003E36",
        "third": "#FFA800",

      },
      fontFamily: {
        QuicksandBold: ["QuicksandBold"],
        QuicksandRegular: ["QuicksandRegular"],
        QuicksandLight: ["QuicksandLight"],
        QuicksandMedium: ["QuicksandMedium"],
        QuicksandSemibold: ["QuicksandSemibold"],
      },
      screens: {
        mobileS: "320px",
        mobileM: "375px",
        mobileL: "425px",
        tablet: "768px",
        laptop: "1024px",
        laptopL: "1440px",
        quattroK: "2560px",
      }
    },
  },
  plugins: [],
}

