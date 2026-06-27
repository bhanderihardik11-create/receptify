/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          900: '#1E3A8A',
          navy: '#0D1B3E',
          ink: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(37,99,235,0.06)',
        glow: '0 4px 14px 0 rgba(37,99,235,0.39)',
        'glow-hover': '0 6px 20px rgba(37,99,235,0.23)',
      },
      backgroundImage: {
        'ambient-mesh':
          'radial-gradient(at 20% 10%, #DBEAFE 0px, transparent 50%), radial-gradient(at 80% 0%, #EFF6FF 0px, transparent 50%), radial-gradient(at 50% 90%, #DBEAFE 0px, transparent 40%)',
        'brand-gradient': 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.6s ease-out both',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(37,99,235,0.5)' },
          '70%': { boxShadow: '0 0 0 18px rgba(37,99,235,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(37,99,235,0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
