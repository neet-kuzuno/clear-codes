/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#A78BFA', // ライト紫
          DEFAULT: '#8B5CF6', // メイン紫
          dark: '#7C3AED', // ダーク紫
        },
        accent: {
          light: '#67E8F9', // ライト水色
          DEFAULT: '#22D3EE', // メイン水色
          dark: '#0EA5E9', // ダーク水色
        },
        background: {
          light: '#1F2937', // ライト背景
          DEFAULT: '#111827', // メイン背景
          dark: '#0F172A', // ダーク背景
        }
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      boxShadow: {
        'glow-purple': '0 0 15px rgba(139, 92, 246, 0.5)',
        'glow-cyan': '0 0 15px rgba(34, 211, 238, 0.5)',
      },
      backgroundImage: {
        'gradient-purple-blue': 'linear-gradient(to right, #8B5CF6, #22D3EE)',
      }
    },
  },
  // 必ず含まれるようにするクラスのリスト
  safelist: [
    'bg-primary',
    'bg-primary-dark',
    'bg-primary-light',
    'text-primary',
    'text-primary-dark',
    'text-primary-light',
    'border-primary',
    'border-primary-dark',
    'border-primary-light',
    'bg-secondary',
    'text-secondary',
    'bg-accent',
    'text-accent',
    'hover:bg-primary-dark',
    'hover:text-primary',
    'focus:ring-primary',
    'focus:ring-primary/50',
  ],
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 