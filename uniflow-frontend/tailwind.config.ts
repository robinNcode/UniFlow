import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0F4C5C',
                    hover: '#0B3A47',
                    light: '#E6EEEF',
                },
                accent: {
                    DEFAULT: '#D97706',
                    light: '#FEF3E2',
                },
                success: {
                    DEFAULT: '#15803D',
                    light: '#E8F5EC',
                },
                danger: {
                    DEFAULT: '#B91C1C',
                    light: '#FBEAEA',
                },
                warning: {
                    DEFAULT: '#D97706',
                    light: '#FEF9C3',
                },
                info: {
                    DEFAULT: '#0369A1',
                    light: '#E0F2FE',
                },
                surface: '#FFFFFF',
                canvas: '#F8FAFC',
                border: '#CBD5E1',
                'border-light': '#E2E8F0',
                'text-primary': '#0F172A',
                'text-secondary': '#475569',
                'text-muted': '#94A3B8',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                bengali: ['Noto Sans Bengali', 'system-ui', 'sans-serif'],
            },
            keyframes: {
                'pulse-live': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.35' },
                },
                'skeleton-shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'fade-in': {
                    'from': { opacity: '0', transform: 'translateY(6px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-up': {
                    'from': { opacity: '0', transform: 'translateY(14px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    'from': { opacity: '0', transform: 'scale(0.94)' },
                    'to': { opacity: '1', transform: 'scale(1)' },
                },
            },
            animation: {
                'pulse-live': 'pulse-live 1.6s ease-in-out infinite',
                'skeleton-shimmer': 'skeleton-shimmer 1.5s ease-in-out infinite',
                'fade-in': 'fade-in 0.35s ease-out',
                'slide-up': 'slide-up 0.3s ease-out',
                'scale-in': 'scale-in 0.2s ease-out',
            },
        },
    },
    plugins: [],
}

export default config
