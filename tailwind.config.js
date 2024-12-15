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
        primary: "#1A202C", // Fondo oscuro elegante
        secondary: "#EDF2F7", // Fondo claro elegante
        accent: "#38B2AC", // Verde agua como color distintivo
        danger: "#E53E3E", // Rojo para errores
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Elegancia moderna
      },
    },
  },
  plugins: [],
};
