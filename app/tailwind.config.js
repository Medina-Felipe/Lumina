/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
 
      colors: {
        // Rojo/Rosa Intenso: E83B61
        'primary-red': '#E83B61', 
        // Amarillo/Ámbar Cálido: FFC533
        'primary-yellow': '#FFC533', 
        
        'app-dark': '#000000', 
      },
    },
  },
  plugins: [],
}