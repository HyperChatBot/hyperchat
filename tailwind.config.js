/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        22: '5.5rem',
        75: '18.75rem'
      },
      colors: {
        'main-purple': '#615ef0',
        'main-gray': '#f1f1f1',
        badge: '#edf2f7',
        'search-input': '#f3f3f3'
      },
      borderRadius: {
        14: '14px'
      },
      boxShadow: {
        sidebar: '0px 0px 24px rgba(0, 0, 0, 0.08)'
      },
      margin: {
        0.5: '0.125rem',
        1.5: '0.75rem',
        2.5: '0.625rem'
      },
      padding: {
        0.5: '0.125rem',
        1.5: '0.75rem',
        2.5: '0.625rem'
      }
    }
  },
  plugins: []
}
