/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'screen': '100vh'
      },
      width: {
        'screen': '100vw'
      },
      scrollbar: {
        thin: {
          width: '2px',
          height: '2px',
        },
        thumb: {
          DEFAULT: '#6b7280',
          hover: '#4b5563',
        },
        track: {
          DEFAULT: '#e5e7eb',
        },
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}



