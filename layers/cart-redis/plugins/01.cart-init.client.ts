export default defineNuxtPlugin({
    name: 'cart-init',
    parallel: false,
    async setup() {
        const { loadCart } = useCart()
        await loadCart()
    },
})