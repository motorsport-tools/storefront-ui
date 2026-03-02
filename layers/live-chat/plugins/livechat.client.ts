import { useCookieConsent } from "../../cookies/composables/useCookieConsent"
import { watch } from "vue"

export default defineNuxtPlugin((nuxtApp) => {
  const { consent } = useCookieConsent("cookieBar.functional.cookies.chat.name")

  const loadLiveChat = () => {
    const baseUrl = useRuntimeConfig().public.odooBaseUrl
    const channelId = useRuntimeConfig().public.livechatChannelId


    if (!baseUrl || !channelId) {
      return
    }

    const script1 = document.createElement('script')
    const slash = baseUrl.endsWith('/') ? '' : '/'
    script1.src = `${baseUrl}${slash}im_livechat/loader/${channelId}`
    script1.async = true

    const script2 = document.createElement('script')
    script2.src = `${baseUrl}${slash}im_livechat/assets_embed.js`
    script2.async = true

    document.head.appendChild(script1)
    document.head.appendChild(script2)
  }

  nuxtApp.hook('app:mounted', () => {
    if (consent.value) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadLiveChat, { timeout: 10000 })
      } else {
        setTimeout(loadLiveChat, 2000)
      }
    }
  })
})