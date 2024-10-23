/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Habilita o modo escuro baseado em classe
  theme: {
    extend: {
      backgroundImage: {
        'custom-linear-gradient': 'linear-gradient(to right, #77530a, #ffd277, #77530a, #77530a, #ffd277, #77530a)',
        'custom-blindado-gradient': 'linear-gradient(135deg, #333333, #5c5c5c, #a6a6a6, #333333)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        'mobile-small': '375px',   // Pequenos dispositivos móveis
        'mobile': '640px',         // Dispositivos móveis normais
        'tablet': '768px',         // Tablets
        'laptop': '1024px',        // Laptops
        'desktop': '1280px',       // Desktops grandes
      },
      height: {
        'mobile-banner': '1000px',       // Para banner mobile
        'tablet-banner': '650px',        // Para tablet
        'desktop-banner': '650px',       // Para desktop
        'small-mobile-banner': '125px',  // Para dispositivos móveis pequenos
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
