/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'custom_blue': '#325da7',
        'custom_orange': '#f68c06',
        'custom_white': '#f7f7f7',
        'custom_black': '#181818'
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('descendant', '& *');
    },
    require('@tailwindcss/forms'),
  ],
}

