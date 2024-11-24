
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient': 'linear-gradient(to top right, #97c4fd, #d5b5fe)',
      },
      colors: {
        'primary-100': "#a5b4fc",
        'primary-200': "#818cf8",
        'secondary-100': "##f1f5f9",
        'secondary-200': "#e8ecf4",
        "dark-100": "#404040",
        'dark-200': "#262626",
        'light-100':  '#f8f4fc',
      }
    },
  },
  plugins: [],
  darkMode: "class",
}

