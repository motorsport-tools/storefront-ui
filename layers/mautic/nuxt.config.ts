// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            link: [
                { rel: 'preload', as: 'script', href: '//mautic.motorsport-tools.co.uk/mtc.js' },
            ],
        },
    },
})
