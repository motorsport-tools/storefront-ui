import Toast, { TYPE } from 'vue-toastification'

export default defineNuxtPlugin(async (nuxtApp) => {
  if (import.meta.client) {
    await import('vue-toastification/dist/index.css')
    nuxtApp.vueApp.use(Toast, {
      timeout: 2000,
      shareAppContext: true,
      onMounted: (_: any, toastApp: any) => {
        toastApp.use(useRouter());
      },
      filterBeforeCreate: (toast: any) => {
        if (toast.type === TYPE.ERROR) {
          const msg = typeof toast.content === 'string' ? toast.content.trim().toLowerCase() : ''
          if (!msg || msg === '' || msg.includes('not found')) {
            return false
          }
        }
        return toast
      },
    })
  }
})
