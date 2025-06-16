<script setup>
const nuxtApp = useNuxtApp();
const { isAuthenticated, loadUser } = useAuth()
const { loadCart } = useCart();



nuxtApp.hook("page:finish", () => {
  window.scrollTo(0, 0);
});

onMounted(async () => {
    console.log('Is Authenticated? ', isAuthenticated.value)
    if ( isAuthenticated.value ) {  
      await loadUser(true)
    }
    await loadCart();  
});

console.log('Env:', process.env)
</script>
<template>
  <div class="h-screen justify-center align-middle">
    <NuxtLoadingIndicator 
      :height="4"
      color="repeating-linear-gradient(to right, #008ebd 0%,#80dfff 50%,#e0f7ff 100%)"
    />

    <NuxtLayout>
      <NuxtPage :page-key="(route) => route.fullPath" />
    </NuxtLayout>
  </div>
</template>
