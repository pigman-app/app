/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores oficiais PigMan
        'brand-green': '#22C55E', // Verde Prosperidade
        'brand-pink': '#EC4899', // Rosa Pig/Avatar
        'brand-yellow': '#EAB308', // Amarelo Foco/Status
        'neutral-bg-light': '#F9FAFB', // Cinza ultra-claro (modo dia)
        'neutral-bg-dark': '#0F172A', // Azul-escuro profundo (modo noite)
        // Aliases para compatibilidade
        'prosperity': '#22C55E',
        'pig': '#EC4899',
        'focus': '#EAB308',
        'neutral-light': '#F9FAFB',
        'neutral-dark': '#0F172A',
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '24px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'soft-shadow': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}

