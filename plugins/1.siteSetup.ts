import { useSiteSetup } from "~/layers/core/composable/useSiteSetup"

export default defineNuxtPlugin(async (nuxtApp) => {
    const { setup, categoriesForMegaMenu } = useSiteSetup()

    // Load once
    await setup()

    // Provide globally
    nuxtApp.provide('categoriesForMegaMenu', categoriesForMegaMenu)
})