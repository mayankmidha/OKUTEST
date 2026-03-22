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
        'oku-cream-warm': '#f5efe3',
        'oku-page-bg': '#FDFCFB',
        'oku-dark': '#2D2926',
        'oku-taupe': '#8C7B6E',
        'oku-purple': '#E8E1EF',
        'oku-purple-dark': '#9D85B3',
        'oku-blue': '#E1E9EF',
        'oku-blue-dark': '#85A6B3',
        'oku-green': '#E1EFEC',
        'oku-green-dark': '#85B3A9',
        'oku-pink': '#EFE1E9',
        'oku-pink-dark': '#B3859D',
        'oku-peach': '#EFEDE1',
        'oku-peach-dark': '#B3AC85',
        'oku-sage': '#E9EFDE',
        'oku-sage-dark': '#9DB385',
        'oku-success': '#10b981',
        'oku-pending': '#f59e0b',
        'oku-danger': '#ef4444',
        'oku-nav-pill': 'rgba(249, 245, 241, 0.75)',
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
