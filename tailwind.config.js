/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        background: '#0f172a',
        surface: '#1e293b',
      },
      fontFamily: {
        game: ['Orbitron', 'sans-serif'],
        text: ['Noto Sans KR', 'sans-serif'],
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '300ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [],
}
