/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#EEF1F8',
          100: '#D5DCEC',
          300: '#7B8AB8',
          500: '#2D4A8A',
          700: '#1A2D5C',
          900: '#0A1A3F',
        },
        royal: {
          400: '#8B6FD1',
          600: '#5B3A9E',
        },
        ember: {
          300: '#F4A86A',
          500: '#E87A2B',
        },
        risk: {
          low:    '#2D8F5F',
          medium: '#E8B82B',
          high:   '#C73E3E',
        },
        canvas: {
          DEFAULT: '#FAFAF7',
          card:    '#FFFFFF',
          border:  '#E2E8F0',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(10, 26, 63, 0.06), 0 1px 2px rgba(10, 26, 63, 0.04)',
        'card-lg': '0 10px 25px rgba(10, 26, 63, 0.08), 0 4px 10px rgba(10, 26, 63, 0.04)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
