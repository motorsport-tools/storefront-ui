export default defineNuxtPlugin((nuxtApp) => {
    if (nuxtApp.ssrContext) {
      // SSR context exists only during SSR
      nuxtApp.vueApp.config.errorHandler = (err, instance, info) => {
        console.error('[Vue SSR ERROR]:', err)
        console.error('Instance:', instance)
        console.error('Info:', info)
      }
    }
  })