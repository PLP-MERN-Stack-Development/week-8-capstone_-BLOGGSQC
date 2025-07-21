/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',     // Indigo
        accent: '#a78bfa',      // Purple
        neon: '#00f0ff',        // Cyan
        glass: 'rgba(255,255,255,0.1)',
      },
      boxShadow: {
        glow: '0 0 25px rgba(99,102,241,0.7)',
        neon: '0 0 15px rgba(0,240,255,0.8)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        futuristic: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
