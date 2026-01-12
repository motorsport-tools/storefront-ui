export default defineNuxtPlugin({
    name: 'cart-init',
    parallel: false,
    async setup() {
        const { loadCart } = useCart()
        // Load cart once when app starts
        await loadCart()
    },
})