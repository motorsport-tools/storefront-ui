// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            link: [
                { rel: 'preload', as: 'script', href: '//cdn.clerk.io/clerk.js'},
            ],
        },
    },
})
