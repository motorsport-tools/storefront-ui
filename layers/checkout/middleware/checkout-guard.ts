export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return
    const { cartIsEmpty, loadCart } = useCart()

    await loadCart(true)

    if (!cartIsEmpty.value) return

    return navigateTo(`/cart`)
});