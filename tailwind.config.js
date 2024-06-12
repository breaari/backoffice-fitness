/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
      },
      colors: {
        rojo: '#C41111', 
        gris: '#4a5568', 
        grismedio: '#9CA3AF'
     
      }
    },
    
  },
  plugins: [],
}
