/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0B1B2B',
        electric: '#2F80FF',
        graylight: '#F5F7FA',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'],
      },
      boxShadow: {
        glow: '0 0 0 4px rgba(47,128,255,0.25)',
      }
    },
  },
  plugins: [],
}
