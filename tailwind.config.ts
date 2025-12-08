import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1a2e',
        foreground: '#eaeaea',
        primary: {
          DEFAULT: '#9333ea',
          dark: '#7e22ce',
          light: '#a855f7',
        },
        card: {
          DEFAULT: '#16213e',
          hover: '#1e2a47',
        },
        border: '#2d3748',
      },
    },
  },
  plugins: [],
}
export default config
