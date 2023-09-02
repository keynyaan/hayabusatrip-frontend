/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-color': '#00aab9',
        'brand-color-opacity-10': '#00aab91A',
        'brand-color-opacity-20': '#00aab933',
        'brand-color-opacity-30': '#00aab94D',
        'brand-color-opacity-40': '#00aab966',
        'brand-color-opacity-50': '#00aab980',
        'brand-color-opacity-60': '#00aab999',
        'brand-color-opacity-70': '#00aab9B3',
        'brand-color-opacity-80': '#00aab9CC',
        'brand-color-opacity-90': '#00aab9E6',
        'twitter-color': '#1DA1F2',
        'github-color': '#171515',
      },
      backgroundColor: {
        'gray-100': 'rgba(243, 244, 246, 1)',
      },
      textOverflow: {
        ellipsis: 'ellipsis',
      },
      gridTemplateColumns: {
        'auto-fill': 'repeat(auto-fill, minmax(16rem, 1fr))',
      },
      screens: {
        w500: '500px',
      },
    },
  },
  plugins: [],
}
