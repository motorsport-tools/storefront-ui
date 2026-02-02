export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return
    const { cartIsEmpty, loadCart } = useCart()

    // LoginMutation allows the cookie to be set, but we need to wait for it to propagate
    // before calling loadCart(true), otherwise we get an empty cart (race condition).
    // We MUST call loadCart(true) to get the FULL cart details required for checkout.
    if (import.meta.client) {
        await new Promise(resolve => setTimeout(resolve, 500))
    }

    await loadCart(true)

    if (!cartIsEmpty.value) return

    return navigateTo(`/cart`)
});