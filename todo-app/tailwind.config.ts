import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#081C2D', // Deep Ocean Blue
        secondary: '#0F2A43', // Secondary Background
        accent: '#00D9C0', // Turquoise
        accentSecondary: '#3B82F6', // Bright Blue
        text: '#F8FAFC', // Soft White
      },
      backgroundColor: {
        primary: '#081C2D',
        secondary: '#0F2A43',
      },
      textColor: {
        primary: '#F8FAFC',
        accent: '#00D9C0',
        accentSecondary: '#3B82F6',
      }
    },
  },
  plugins: [],
}

export default config
