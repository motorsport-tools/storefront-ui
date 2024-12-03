// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        elastic: {
            apiKey: process.env.NUXT_ELASTIC_API_KEY,
            hostname: process.env.NUXT_ELASTIC_HOSTNAME,
            index: process.env.NUXT_ELASTIC_INDEX,
        }
    },

    // Allow access to Elasticsearch host in CSP
    nitro: {
        routeRules: {
        '/**': {
            headers: {
            'Access-Control-Allow-Origin': process.env.NUXT_ELASTIC_HOSTNAME || 'http://localhost:9200',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }
        }
    }

});
