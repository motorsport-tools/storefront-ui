<template>
    <div class="container">
        <p>{{ message }}
            <NuxtLink v-if="route.path !== '/cart'"  to="/cart" class="underline cursor-pointer" :title="$t('cartLinkTitle')">{{ $t('cart') }}</NuxtLink>
        </p>
    </div>
</template>

<script setup lang="ts">

const route = useRoute();

defineProps({
    message: String
})
</script>