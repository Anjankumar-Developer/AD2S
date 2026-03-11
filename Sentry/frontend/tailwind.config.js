/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Minimalist B&W Theme Palette
                'minimal-bg': '#ffffff',
                'minimal-surface': '#f8fafc',
                'minimal-border': '#e2e8f0',

                // Text
                'minimal-text': '#0f172a',
                'minimal-text-muted': '#64748b',

                // Accents - Deep Slate/Black
                'minimal-accent': '#0f172a',
                'minimal-accent-hover': '#334155',

                // Functional states
                'minimal-success': '#059669',
                'minimal-error': '#dc2626',
                'minimal-warning': '#d97706',
            },
            fontFamily: {
                'display': ['Inter', 'sans-serif'],
                'body': ['Inter', 'sans-serif'],
                'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'float-subtle': 'floatSubtle 8s ease-in-out infinite',
                'shimmer': 'shimmer 2.5s infinite linear',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                floatSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                }
            },
            boxShadow: {
                'minimal-card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'minimal-card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
                'minimal-focus': '0 0 0 2px #ffffff, 0 0 0 4px #0f172a',
            }
        },
    },
    plugins: [],
}
