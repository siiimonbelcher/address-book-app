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
        background: '#0a0a0a',
        foreground: '#f5f5f7',
        primary: {
          DEFAULT: '#ff6b35',
          dark: '#ff5722',
          light: '#ff8c66',
        },
        secondary: {
          DEFAULT: '#bf5af2',
          dark: '#9333ea',
          light: '#d084ff',
        },
        card: {
          DEFAULT: '#1c1c1e',
          hover: '#2c2c2e',
        },
        border: '#38383a',
      },
    },
  },
  plugins: [],
}
export default config
