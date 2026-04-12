/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  safelist: [
    {
      pattern: /^(from|to|bg|text)-(blue|green|purple|orange|pink|teal|rose|cyan|amber|emerald|fuchsia|slate|gray|indigo|violet|red|yellow|sky|lime)-(50|600|700)/,
    },
    {
      pattern: /^hover:bg-(blue|green|purple|orange|pink|teal|rose|cyan|amber|emerald|fuchsia|slate|gray|indigo|violet|red|yellow|sky|lime)-(700)/,
    },
    {
      pattern: /^border-(blue|green|purple|orange|pink|teal|rose|cyan|amber|emerald|fuchsia|slate|gray|indigo|violet|red|yellow|sky|lime)-(400)/,
    },
  ],
};