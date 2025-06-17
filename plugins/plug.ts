import { defineNuxtPlugin } from '#app'
import SfButtonErrorWrapper from '~/plugins/sfbutton-error-wrapper'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('SfButton', SfButtonErrorWrapper)
})