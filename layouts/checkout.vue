<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';

const {
    data: siteData,
    error: siteError,
    refresh,
} = await useFetch('/api/site-data', {
    key: 'site-data',
})
const navigationMenu = computed(() => siteData.value?.headerNavigation || {})
const { cart, loading } = useCart();
</script>

<template>
    <SiteCheckoutHeader/>
    <div class="relative z-1 h-full">
        <span v-if="loading && !cart" class="!flex justify-center my-40 h-24">
            <SfLoaderCircular size="2xl" />
        </span>
        <slot v-else></slot>
    </div>
    <LazySiteFooter 
      hydrate-on-visible 
      ref="footerRef"
      :navigation="navigationMenu"
      :globals="siteData?.globals || {}"
    />

</template>