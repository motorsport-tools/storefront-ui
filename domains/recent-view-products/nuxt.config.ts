// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
      ...(process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development'
        ? ['@nuxt/test-utils/module']
        : [])
    ]
  })