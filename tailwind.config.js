/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#0b0e14',
        surface:  '#151921',
        surface2: '#1c2333',
        border:   '#1e2d3d',
        accent:   '#00d4ff',
        accent2:  '#7c3aed',
        muted:    '#4a5568',
        text:     '#e2e8f0',
        subtext:  '#94a3b8',
      },
      fontFamily: {
        display: ['"Outfit"', 'sans-serif'],
        body:    ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite linear',
        fadeUp:  'fadeUp 0.4s ease forwards',
        pulse2:  'pulse2 1.5s ease-in-out infinite',
      },
      backgroundImage: {
        shimmer: 'linear-gradient(90deg, #1c2333 25%, #243044 50%, #1c2333 75%)',
      },
    },
  },
  plugins: [],
}
