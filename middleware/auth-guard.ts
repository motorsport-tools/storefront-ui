/*
* Logged in no need to see here
*/
export default defineNuxtRouteMiddleware(async (to, from) => {
    const userCookie = useCookie<any | null>("odoo-user", { maxAge: 3600 * 30, sameSite: "lax" })
    const isAuthenticated = Boolean(userCookie.value)
    if (isAuthenticated) {
        return navigateTo('/my-account/personal-data', { redirectCode: 301, replace: true })
    }
})