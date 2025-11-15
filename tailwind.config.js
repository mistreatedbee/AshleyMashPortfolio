/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#021226',
        'neon-cyan': '#00f0d3',
        'electric-blue': '#0fb9f1',
        'dark-blue': '#041a33',
        'light-blue': '#0a2e5c',
      },
      fontFamily: {
        'sora': ['Sora', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'space': ['Space Grotesk', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'drift': 'drift 15s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'spin-slow': 'spin 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.8, filter: 'brightness(1)' },
          '50%': { opacity: 1, filter: 'brightness(1.3)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(5px, 10px)' },
          '50%': { transform: 'translate(10px, 0)' },
          '75%': { transform: 'translate(5px, -10px)' },
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '30%': { transform: 'rotate(14deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '60%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00f0d3, 0 0 20px rgba(0, 240, 211, 0.3)',
        'neon-blue': '0 0 5px #0fb9f1, 0 0 20px rgba(15, 185, 241, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, rgba(15, 185, 241, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 185, 241, 0.1) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}