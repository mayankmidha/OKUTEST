import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- NANO BANANA PRO PASTEL PALETTE ---
        'oku-lavender': '#E8E4F9',
        'oku-blush': '#F9E4EE',
        'oku-mint': '#E4F9F0',
        'oku-peach': '#F9EDE4',
        'oku-butter': '#F9F7E4',
        'oku-babyblue': '#E4EEF9',
        'oku-darkgrey': '#4A4458',
        'oku-dark': '#2D2D2D',
        
        // Dark Mode Pastels
        'oku-dark-lavender': '#2D2640',
        'oku-dark-blush': '#3D2E3A',
        'oku-dark-mint': '#2E3D38',
        'oku-dark-peach': '#3D342E',
        'oku-dark-butter': '#3D3C2E',
        'oku-dark-babyblue': '#2E353D',

        // Keep some existing for compatibility if needed, but remap
        'oku-cream': '#FDFCF8',
        'oku-purple': '#E8E4F9',
        'oku-purple-dark': '#A599E0',
        'oku-navy': '#4A4458',
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'DM Sans', 'sans-serif'],
        'body': ['Plus Jakarta Sans', 'DM Sans', 'sans-serif'],
        'serif': ['Cormorant Garamond', 'serif'],
        'cursive': ['Nothing You Could Do', 'cursive'],
      },
      borderRadius: {
        'button': '12px',
        'card': '24px',
        'modal': '32px',
        'pill': '100000px',
      },
      boxShadow: {
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.05)',
        'pastel': '0 10px 30px -5px rgba(166, 155, 191, 0.1)',
      },
      spacing: {
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
