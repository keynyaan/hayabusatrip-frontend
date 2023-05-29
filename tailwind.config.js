/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-color': '#00aab9',
      },
      backgroundColor: {
        'gray-100': 'rgba(243, 244, 246, 1)',
      },
      textOverflow: {
        ellipsis: 'ellipsis',
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(17rem, 1fr))',
      },
    },
  },
  plugins: [],
}
