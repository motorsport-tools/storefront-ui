export default defineNuxtPlugin(() => {
  onMounted(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadLiveChat)
    } else {
      setTimeout(loadLiveChat, 2000) 
    }
  })

  function loadLiveChat() {
    const baseUrl = useRuntimeConfig().public.NUXT_PUBLIC_ODOO_BASE_URL
    const channelId = useRuntimeConfig().public.NUXT_PUBLIC_LIVECHAT_CHANNEL_ID

    if (!baseUrl || !channelId) return

    const script1 = document.createElement('script')
    script1.src = `${baseUrl}im_livechat/loader/${channelId}`
    script1.async = true

    const script2 = document.createElement('script')
    script2.src = `${baseUrl}im_livechat/assets_embed.js`
    script2.async = true

    document.head.appendChild(script1)
    document.head.appendChild(script2)
  }
})