/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        illinois: {
          blue: '#13294B',
          orange: '#FF552E',
        },
        purdue: {
          gold: '#CEB888',
          black: '#212721',
        },
      },
    },
  },
  plugins: [],
}