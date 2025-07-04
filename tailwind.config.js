module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        wood: 'var(--wood-color)',
        fire: 'var(--fire-color)',
        earth: 'var(--earth-color)',
        metal: 'var(--metal-color)',
        water: 'var(--water-color)',
      },
    },
  },
  plugins: [],
} 