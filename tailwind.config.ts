import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- NEW PASTEL PREMIUM PALETTE ---
        'oku-cream': '#FAF9F6',
        'oku-cream-warm': '#F5F2EA',
        'oku-page-bg': '#FCFAF7',
        'oku-dark': '#1C1B1A',
        'oku-navy': '#1A2E35',
        'oku-navy-light': '#2C4A55',
        'oku-taupe': '#7A7167',
        
        // Refined Pastels
        'oku-lavender': '#F3F0F7',
        'oku-lavender-dark': '#A69BBF',
        'oku-glacier': '#F0F4F7',
        'oku-glacier-dark': '#9BB0BF',
        'oku-matcha': '#F2F5F0',
        'oku-matcha-dark': '#A0BF9B',
        'oku-rose': '#F7F0F2',
        'oku-rose-dark': '#BF9BA6',
        'oku-champagne': '#F7F5F0',
        'oku-champagne-dark': '#BFB09B',
        'oku-sky': '#F0F7FF',
        'oku-ocean': '#E0EEF5',
        'oku-peach': '#FBEDE5',
        'oku-peach-dark': '#D8A48C',
        'oku-mint': '#EAF6F1',
        'oku-mint-dark': '#8DB8A8',
        'oku-butter': '#FFF6DB',
        'oku-butter-dark': '#D6B66B',
        'oku-lilac': '#EEE8F8',
        'oku-lilac-dark': '#B5A3D6',

        // Legacy compatibility (mapped to new tones)
        'oku-purple': '#F3F0F7',
        'oku-purple-dark': '#A69BBF',
        'oku-blue': '#F0F4F7',
        'oku-blue-mid': '#B8CEDC',
        'oku-blue-dark': '#85A6B3',
        'oku-green': '#F2F5F0',
        'oku-green-dark': '#A0BF9B',
        'oku-pink': '#F7F0F2',
        'oku-pink-dark': '#BF9BA6',
        'oku-sage': '#F2F5F0',
        'oku-sage-dark': '#A0BF9B',
        
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
