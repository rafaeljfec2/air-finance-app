/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores da marca
        brand: {
          leaf: '#8CCFB0', // Cor da folha
          arrow: '#2D6B4E', // Cor da seta
        },
        // Cores principais
        primary: {
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
    },
  },
  plugins: [],
} 