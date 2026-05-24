/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        deepBlue: '#1E40AF',
        neonPurple: '#9333EA',
        bgWhite: '#F8FAFC',
        textDark: '#1F2937',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 64, 175, 0.15)'
      },
    },
  },
  plugins: [],
}
