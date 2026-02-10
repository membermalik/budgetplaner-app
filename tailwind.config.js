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
                surface: {
                    DEFAULT: 'var(--surface)',
                    hover: 'var(--surface-hover)',
                    active: 'var(--surface-active)',
                    border: 'var(--surface-border)',
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    foreground: 'var(--accent-foreground)',
                    glow: 'var(--accent-glow)',
                },
                secondary: 'var(--secondary)',
                success: 'var(--success)',
                warning: 'var(--warning)',
                danger: 'var(--danger)',
                text: {
                    main: 'var(--text-main)',
                    dim: 'var(--text-dim)',
                    inverse: 'var(--text-inverse)',
                },
                // Legacy mappings for backward compatibility during refactor
                'text-main': 'var(--text-main)',
                'text-dim': 'var(--text-dim)',
                'surface-border': 'var(--surface-border)',
                'surface-hover': 'var(--surface-hover)',
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
