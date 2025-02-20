// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            script: [
                {
                    src: "https://odoo.motorsport-tools.co.uk/im_livechat/loader/1",
                    async: true,
                },
                {
                    src: "https://odoo.motorsport-tools.co.uk/im_livechat/assets_embed.js",
                    async: true,
                },
            ],
        },
    },
    runtimeConfig: {},
});
