export default defineNuxtRouteMiddleware(async (to, from) => {
  const { hydrateAuthOnce, user } = useAuth()

  await hydrateAuthOnce()

  const isAuthenticated = Boolean(user.value?.id) && !user.value?.isPublic
  if (!isAuthenticated) {
    return `/login?redirect=${encodeURIComponent(to.fullPath)}`
  }
});
