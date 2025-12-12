export default defineNuxtRouteMiddleware(async (to, from) => {
    const { cartIsEmpty } = useCart()
    if (cartIsEmpty) {
        return `/cart`
    }
    return true
});