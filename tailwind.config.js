/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vw: {
          blue: '#001e50',
          'blue-dark': '#001333',
          'blue-light': '#00437a',
          cyan: '#00b1eb',
          'cyan-hover': '#0096c7',
          red: '#d5001c',
          dark: '#08111f',
          ink: '#132033',
          muted: '#64748b',
          line: '#d9e2ec',
          bg: '#f4f7fb',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'vw-card': '0 12px 32px rgba(8, 17, 31, 0.08)',
        'vw-hover': '0 20px 40px rgba(0, 30, 80, 0.16)',
        'vw-float': '0 10px 25px rgba(0, 30, 80, 0.25)',
      }
    },
  },
  plugins: [],
}
