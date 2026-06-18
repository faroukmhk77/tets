/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A96E',
          50: '#FBF7F0',
          100: '#F5EAD8',
          200: '#EBD5B1',
          300: '#DDBF86',
          400: '#C9A96E',
          500: '#B8944A',
          600: '#9A7A3C',
          700: '#7A6030',
          800: '#5C4824',
          900: '#3E3018',
        },
        cream: {
          DEFAULT: '#F5F0E8',
          50: '#FDFCFA',
          100: '#FAF7F2',
          200: '#F5F0E8',
          300: '#E8DFD0',
          400: '#D4C7B0',
          500: '#BFAD90',
          600: '#A69275',
          700: '#8A7660',
          800: '#6E5D4B',
          900: '#524538',
        },
        // Dynamic theme colors (CSS variables)
        theme: {
          bg: 'var(--color-bg)',
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)',
          text: 'var(--color-text)',
          button: 'var(--color-button)',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
