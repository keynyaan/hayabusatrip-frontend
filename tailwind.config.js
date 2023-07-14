/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-color': '#00aab9',
        'brand-color-opacity-50': '#00aab980',
      },
      backgroundColor: {
        'gray-100': 'rgba(243, 244, 246, 1)',
      },
      textOverflow: {
        ellipsis: 'ellipsis',
      },
      gridTemplateColumns: {
        'auto-fill': 'repeat(auto-fill, minmax(14rem, 1fr))',
      },
      minWidth: {
        6: '1.5rem',
      },
      minHeight: {
        6: '1.5rem',
      },
      maxWidth: {
        10: '2.5rem',
      },
      maxHeight: {
        10: '2.5rem',
      },
    },
  },
  plugins: [],
}
