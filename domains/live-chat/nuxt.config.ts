// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            script: [
                {
                    src: process.env.NUXT_PUBLIC_ODOO_BASE_URL+"im_livechat/loader/"+process.env.NUXT_PUBLIC_LIVECHAT_CHANNEL_ID,
                    async: true,
                },
                {
                    src: process.env.NUXT_PUBLIC_ODOO_BASE_URL+"im_livechat/assets_embed.js",
                    async: true,
                },
            ],
        },
    },
    runtimeConfig: {},
});
