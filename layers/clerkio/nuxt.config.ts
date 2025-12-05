// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            link: [
                { rel: 'preload', as: 'script', href: '//cdn.clerk.io/clerk.js' },
            ],
        },
    },
    runtimeConfig: {
        clerkKey: process.env.NUXT_CLERK_KEY || '',
        public: {
            search: {
                host: 'localhost',
                searchApiKey: 'xxx',
                indexName: 'searchIndex',
                options: {
                    primaryKey: 'id',
                    keepZeroFacets: false,
                    finitePagination: false,
                },
            },
        },
    },
    /*
    build: {
        transpile: ["vue-instantsearch", "instantsearch.js/es"],
    },
    */
})
