/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        2.5: '0.625rem', // 10px
        22: '5.5rem', // 88px
        75: '18.75rem', // 300px
        160: '40rem' // 64px
      },
      height: {
        2.5: '0.625rem' // 10px
      },
      colors: {
        'main-purple': '#615ef0',
        'main-gray': '#f1f1f1',
        'default-badge': '#edf2f7',
        'search-input': '#f3f3f3',
        'status-green': '#68d391'
      },
      borderRadius: {
        14: '0.875rem' // 14px
      },
      boxShadow: {
        sidebar: '0px 0px 24px rgba(0, 0, 0, 0.08)'
      },
      margin: {
        0.5: '0.125rem', // 2px
        1.5: '0.375rem', // 6px
        2.5: '0.625rem', // 10px
        3.5: '0.875rem' // 14px
      },
      padding: {
        0.5: '0.125rem', // 2px
        1.5: '0.375rem', // 6px
        2.5: '0.625rem' // 10px
      },
      top: {
        3.5: '0.875rem' // 14px
      },
    }
  },
  plugins: []
}
