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
        },
        // 設定画面用の追加カラー
        gray: {
          750: '#1e2533', // gray-700とgray-800の間
          850: '#141c2b', // gray-800とgray-900の間
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
        'inner-dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)'
      },
      backgroundImage: {
        'gradient-purple-blue': 'linear-gradient(to right, #8B5CF6, #22D3EE)',
        'gradient-purple-indigo': 'linear-gradient(to right, #8B5CF6, #4F46E5)',
        'gradient-dark': 'linear-gradient(to bottom, #1F2937, #111827)',
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
    'bg-gray-750',
    'bg-gray-850',
    'bg-gradient-purple-indigo',
    'bg-gradient-dark',
  ],
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 