export default defineNuxtRouteMiddleware(() => {
    const { isAuthenticated } = useAuth()

    console.log('Guest Authed? ', isAuthenticated.value)

    if (!isAuthenticated.value) return

    return navigateTo('/')
})