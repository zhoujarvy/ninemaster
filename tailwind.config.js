/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 深空底
        space: {
          900: '#0f0830',
          800: '#1a1140',
          700: '#251a5c',
          600: '#332591'
        },
        // 糖果马卡龙
        candy: {
          pink: '#ff8fb1',
          peach: '#ffb38a',
          lemon: '#ffe066',
          mint: '#7eebc5',
          sky: '#7ec8ff',
          lilac: '#c4a6ff'
        }
      },
      fontFamily: {
        display: '"Fredoka", "LXGW WenKai TC", system-ui, sans-serif',
        han: '"LXGW WenKai TC", "PingFang SC", system-ui, sans-serif',
        num: '"Fredoka", system-ui, sans-serif'
      },
      boxShadow: {
        soft: '0 10px 30px -8px rgba(80, 60, 180, 0.45)',
        glow: '0 0 30px rgba(255, 143, 177, 0.6)'
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.12)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '20%': { transform: 'translateX(-8px) rotate(-2deg)' },
          '40%': { transform: 'translateX(8px) rotate(2deg)' },
          '60%': { transform: 'translateX(-6px) rotate(-1deg)' },
          '80%': { transform: 'translateX(6px) rotate(1deg)' }
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(0) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(0) rotate(-360deg)' }
        },
        shoot: {
          '0%': { transform: 'translate(0,0) rotate(45deg)', opacity: '1' },
          '100%': { transform: 'translate(120px,120px) rotate(45deg)', opacity: '0' }
        }
      },
      animation: {
        pop: 'pop 0.35s ease-out',
        shake: 'shake 0.5s ease-in-out',
        twinkle: 'twinkle 3s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        orbit: 'orbit 12s linear infinite',
        shoot: 'shoot 1.2s ease-out'
      }
    }
  },
  plugins: []
}
