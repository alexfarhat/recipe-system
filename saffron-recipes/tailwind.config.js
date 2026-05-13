

export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        canvas: '#F6F3EE',
        parchment: '#F6F3EE',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#7A1F1F',
          hover: '#5E1818',
        },
        paprika: {
          DEFAULT: '#7A1F1F',
          hover: '#5E1818',
        },
        accent: '#B08D57',
        saffron: '#B08D57',
        forest: '#2F4A3E',
        herb: '#2F4A3E',
        tomato: '#B23A3A',
        'text-dark': '#1F1B18',
        'text-muted': '#6B6259',
        border: '#E5E0D8',
        'border-strong': '#D6CFC2',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgb(0 0 0 / 0.03), 0 1px 1px 0 rgb(0 0 0 / 0.02)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [],
}

