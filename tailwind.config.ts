import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'oku-cream': '#faf8f3',
        'oku-page-bg': '#F0E7DE',
        'oku-dark': '#2d2d2d',
        'oku-purple': '#d4c5e8',
        'oku-blue': '#c5dde8',
        'oku-taupe': '#8b8680',
        'oku-nav-pill': '#F9F5F1BF',
        'oku-success': '#10b981',
        'oku-pending': '#f59e0b',
        'oku-danger': '#ef4444',
        'oku-info': '#3b82f6',
        'oku-pink': '#f8b4d8',
        'oku-green': '#b8e8b8',
        'oku-orange': '#f5d4a8',
        'oku-red': '#f5b8b8',
        'oku-cream-warm': '#f5efe3',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'script': ['Caveat', 'cursive'],
      },
      borderRadius: {
        'button': '8px',
        'card': '12px',
        'modal': '16px',
        'pill': '100000px',
      },
      spacing: {
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      rotate: {
        '4': '4deg',
        '-4': '-4deg',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
