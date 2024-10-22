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
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        'mobile-small': '375px',  // Pequenos dispositivos móveis
        'mobile': '640px',        // Dispositivos móveis normais
        'tablet': '768px',        // Tablets
        'laptop': '1024px',       // Laptops
        'desktop': '1280px',      // Desktops grandes
      },
      height: {
        'mobile-banner': '1000px',  // Para banner mobile
        'tablet-banner': '650px',   // Para tablet
        'desktop-banner': '650px',  // Para desktop
        'small-mobile-banner': '125px', // Para dispositivos móveis pequenos
      },
    },
  },
  plugins: [],
};
