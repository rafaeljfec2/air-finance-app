/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cores da marca
        brand: {
          leaf: '#8CCFB0', // Cor da folha
          arrow: '#2D6B4E', // Cor da seta
        },
        // Cores principais (+ DEFAULT para bg-primary / text-primary)
        primary: {
          DEFAULT: '#2D6B4E',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
          50: '#f0faf5',
          100: '#d5f1e3',
          200: '#8CCFB0', // Mesma cor da folha
          300: '#70c299',
          400: '#4aaf7d',
          500: '#2D6B4E', // Mesma cor da seta
          600: '#25573f',
          700: '#1d4331',
          800: '#152f23',
          900: '#0c1a14',
        },
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        muted: {
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        input: 'rgb(var(--border-input) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        ring: 'rgb(var(--ring) / <alpha-value>)',
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        // Cores semânticas para o tema claro
        background: '#F8FAF9', // Fundo mais suave, com um toque de verde
        card: '#FFFFFF',
        text: '#1A2825', // Verde muito escuro, quase preto
        border: '#E8EFEC', // Borda mais suave com tom esverdeado
        // Cores semânticas para o tema escuro
        'background-dark': '#111827',
        'card-dark': '#1f2937',
        'text-dark': '#f9fafb',
        'border-dark': '#374151',
      },
      spacing: {
        'safe-top': 'var(--safe-area-inset-top)',
        'safe-right': 'var(--safe-area-inset-right)',
        'safe-bottom': 'var(--safe-area-inset-bottom)',
        'safe-left': 'var(--safe-area-inset-left)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
