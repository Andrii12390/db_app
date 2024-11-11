
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
        'primary-200': "#818cf8",
        'primary-100': "#a5b4fc",
        'secondary-100': "##f1f5f9",
        'secondary-200': "#e8ecf4",
        'light-100':  '#f8f4fc',
        'dark-200': "#262626",
        "dark-100": "#404040"
      }
    },
  },
  plugins: [],
  darkMode: "class",
}

