module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b3d9ff',
          300: '#80c2ff',
          400: '#4da6ff',
          500: '#1a8bff',
          600: '#0070d8',
          700: '#0056ad',
          800: '#003d7a',
          900: '#002652',
        },
        secondary: {
          50: '#f3f8ff',
          100: '#e8f1ff',
          200: '#c5dcff',
          300: '#a3c7ff',
          400: '#80b3ff',
          500: '#5d9eff',
          600: '#4a8aff',
          700: '#3775ff',
          800: '#2560ff',
          900: '#134bff',
        },
        accent: {
          50: '#f0fdf4',
          100: '#e0fce8',
          200: '#bffdce',
          300: '#9ffcb5',
          400: '#7efb9b',
          500: '#5ef982',
          600: '#45f768',
          700: '#2cf54f',
          800: '#13f336',
          900: '#00e01c',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
