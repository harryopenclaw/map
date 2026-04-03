/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        cream: '#F5F3EF',
        magenta: '#8B3A62',
        hotpink: '#E91E8C',
        coral: '#F28B6D',
        'coral-end': '#F5A962',
        teal: '#2A9D8F',
        'deep-purple': '#6C4AB6',
        amber: '#F59E0B',
        'card-yellow': '#F9E547',
        'card-orange': '#F5A070',
        'card-lavender': '#A99BDB',
        'card-green': '#7EC8A0',
        'card-blue': '#7BB5E3',
      },
      borderRadius: {
        card: '12px',
        col: '12px',
      },
    },
  },
  plugins: [],
}
