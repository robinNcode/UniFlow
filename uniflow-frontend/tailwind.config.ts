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
                surface: '#FFFFFF',
                canvas: '#F8FAFC',
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
            },
            animation: {
                'pulse-live': 'pulse-live 1.6s ease-in-out infinite',
                'skeleton-shimmer': 'skeleton-shimmer 1.5s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}

export default config
