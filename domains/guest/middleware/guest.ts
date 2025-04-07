export default defineNuxtRouteMiddleware(() => {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated.value) return

    return navigateTo('/')
})