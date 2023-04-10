/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        22: '5.5rem'
      },
      colors: {
        'main-purple': '#615ef0',
        'main-gray': '#f1f1f1'
      },
      borderRadius: {
        14: '14px'
      },
      boxShadow: {
        sidebar: '0px 0px 24px rgba(0, 0, 0, 0.08)'
      }
      
    }
  },
  plugins: []
}
