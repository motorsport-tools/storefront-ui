import type { Config } from 'tailwindcss';
import { tailwindConfig } from '@storefront-ui/vue/tailwind-config';
import sfTypography from '@storefront-ui/typography';

export default <Config>{
  presets: [tailwindConfig],
  content: ['./**/*.vue', 'node_modules/@storefront-ui/vue/**/*.{js,mjs}'],
  plugins: [sfTypography],
  css: ['~/assets/css/tailwind.css'],

  theme: {
    extend: {
      screens: {
        xxl: '1440px',
        xs: '376px',
      },
      zIndex: {
        60: '60',
        80: '60',
        100: '100',
      },
      colors: {
        primary: {
          '50': '#fff1f1',
          '100': '#ffe1e1',
          '200': '#ffc8c9',
          '300': '#ffa1a3',
          '400': '#fe6b6d',
          '500': '#f73c3f',
          '600': '#e51d20',
          '700': '#cd1619',
          '800': '#9f1517',
          '900': '#84181a',
          '950': '#480708',
        },
      },
    },
  },
};
