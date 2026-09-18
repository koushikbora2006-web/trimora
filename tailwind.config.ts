import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          noir: '#0A0A0A',
          dark: '#111111',
          card: '#151515',
          surface: '#1A1A1A',
          elevated: '#222222',
          gold: '#C5A880',
          champagne: '#D4AF37',
          softgold: '#E5C590',
          darkgold: '#9B783E',
          bronze: '#A68252',
          ivory: '#F7F4EE',
          warmwhite: '#FAF8F5',
          muted: '#9E988F',
          lightmuted: '#BEB8AE',
          subtle: '#66615B',
          cream: '#1E1C1A',
          sand: '#282522',
          taupe: '#3D3934',
          charcoal: '#121212',
          deep: '#080808',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 50px -15px rgba(0, 0, 0, 0.8)',
        'luxury-card': '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
        'gold-glow': '0 0 30px rgba(197, 168, 128, 0.22)',
        'gold-glow-lg': '0 0 50px rgba(197, 168, 128, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};

export default config;
