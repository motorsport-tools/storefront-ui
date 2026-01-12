<script setup>
import { useMegaMenuCategories } from "~/layers/core/composable/useMegaMenuCategories"
const nuxtApp = useNuxtApp();
const { isAuthenticated, loadUser } = useAuth()

const { loadWishlist } = useWishlist()

const router = useRouter()
const route = useRoute()
router.afterEach((to, from) => {
  if (to.path === from.path && to.query.page !== from.query.page) {
    window.scrollTo(0, 0)
  }
})

const { loadCategoriesForMegaMenu, categoriesForMegaMenu } = useMegaMenuCategories()

provide(
  "categoriesForMegaMenu",
  categoriesForMegaMenu
);

await loadCategoriesForMegaMenu({ filter: { parent: true }, pageSize: 4 })

onMounted(async () => {
  if(import.meta.client) {
    if ( isAuthenticated.value ) {  
      await loadUser(true)
      await loadWishlist()
    }
  }
})
</script>
<template>
  <div class="min-h-screen justify-center align-middle">
    <NuxtLoadingIndicator 
      :height="4"
      color="repeating-linear-gradient(to right, #008ebd 0%,#80dfff 50%,#e0f7ff 100%)"
    />
    <NuxtLayout :key="`${$route.meta.layout}-${$route.fullPath}`">
      <NuxtPage :page-key="(route) => route.path" />
    </NuxtLayout>
  </div>
</template>
