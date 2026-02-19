/*
* Logged in no need to see here
*/
export default defineNuxtRouteMiddleware(async (to, from) => {
    const { hydrateAuthOnce, user } = useAuth()

    await hydrateAuthOnce()

    const isAuthenticated = Boolean(user.value?.id) && !user.value?.isPublic
    if (isAuthenticated) {
        return navigateTo('/my-account/personal-data', { redirectCode: 301, replace: true })
    }
})
