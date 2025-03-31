// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            directus: {
                url: process.env?.NUXT_PUBLIC_DIRECTUS_URL
            }
        }
    },
    hooks: {
        'pages:extend': (pages) => {
            // Custom route to override the default `index.vue`
            const indexPagePath = resolve(__dirname, 'pages/index.vue');
            pages.push({
                name: 'index',
                path: '/',
                file: indexPagePath,  // Specify the custom page in the domain folder
            });
        },
    },
})