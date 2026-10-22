<script setup>
const router = useRouter()
const route = useRoute()
const siteConfig = useSiteConfig()

const canonicalUrl = computed(() => {
  const siteUrl = (siteConfig.url || 'https://motorsport-tools.com').replace(/\/+$/, '')
  const path = route.path === '/' ? '/' : route.path.replace(/\/+$/, '')
  const page = Number(route.query?.page)
  const pageQuery = Number.isInteger(page) && page > 1 ? `?page=${page}` : ''
  return `${siteUrl}${path}${pageQuery}`
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})

router.afterEach((to, from) => {
  if (to.path === from.path && to.query.page !== from.query.page) {
    window.scrollTo(0, 0)
  }
})
</script>
<template>
  <div class="min-h-screen justify-center align-middle">
    <NuxtLoadingIndicator 
      :height="4"
      color="repeating-linear-gradient(to right, #008ebd 0%,#80dfff 50%,#e0f7ff 100%)"
    />
    <NuxtLayout :key="$route.meta.layout">
      <NuxtPage :page-key="(route) => route.path" />
    </NuxtLayout>
    <CookieBanner />
  </div>
</template>
