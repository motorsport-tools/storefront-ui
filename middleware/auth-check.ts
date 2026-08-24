export default defineNuxtRouteMiddleware(async (to, from) => {
  const { hydrateAuthOnce, user, isAuthenticated: authIsAuthenticated } = useAuth()

  await hydrateAuthOnce()
  const isAuthenticated = Boolean(user.value?.id) && !user.value?.isPublic && authIsAuthenticated
  if (!isAuthenticated) {
    return `/login?redirect=${encodeURIComponent(to.fullPath)}`
  }
});
