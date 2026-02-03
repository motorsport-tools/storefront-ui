<script setup>
const router = useRouter()
const route = useRoute()
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
  </div>
</template>
