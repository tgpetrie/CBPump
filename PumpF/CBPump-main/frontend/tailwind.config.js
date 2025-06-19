export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100px)' }
        }
      },
      animation: {
        slide: 'slide 2s ease-in-out infinite'
      }
    }
  },
  plugins: []
}