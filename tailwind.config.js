/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--bg-color)',
                surface: 'var(--surface)',
                'surface-border': 'var(--surface-border)',
                'surface-hover': 'var(--surface-hover)',
                accent: 'var(--accent)',
                'accent-glow': 'var(--accent-glow)',
                secondary: 'var(--secondary)',
                success: 'var(--success)',
                warning: 'var(--warning)',
                danger: 'var(--danger)',
                'text-main': 'var(--text-main)',
                'text-dim': 'var(--text-dim)',
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                '2xl': '18px',
                '3xl': '24px',
            },
            boxShadow: {
                card: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
                glow: '0 0 30px rgba(99, 102, 241, 0.3)',
            },
            backdropBlur: {
                glass: '25px',
            },
        },
    },
    plugins: [],
}
