/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        panel: "#12181b",
        panelLight: "#1a2226",
        brandGreen: "#8bc34a",
        brandBlue: "#3b82c4",
        sidebarBg: "#0d1214",
      },
    },
  },
  plugins: [],
};
