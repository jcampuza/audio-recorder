module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        128: '32rem',
        144: '36rem',
      },

      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  variants: {
    extend: {
      margin: ['last'],
      padding: ['last'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
