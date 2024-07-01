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
    screens: {
      mq1024: {
        raw: "screen and (max-width: 1024px)",
      },
      mq980: {
          raw: "screen and (max-width: 980px)",
        },
      mq780: {
        raw: "screen and (max-width: 780px)",
      }
    }
    
  },
  plugins: [],
}
