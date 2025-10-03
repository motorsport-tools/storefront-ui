<script lang="ts" setup>
defineProps({
  error: Object
})

const { isVisualEditingEnabled } = useVisualEditing()

const {
    data: siteData,
    error: siteError,
    refresh,
} = await useFetch('/api/site-data', {
    key: 'site-data',
    headers: isVisualEditingEnabled ? { 'x-invalidate': '1' } : {},
    cache: isVisualEditingEnabled? 'no-cache' : 'default'
})

const navigationMenu = computed(() => siteData.value?.headerNavigation || {})
</script>

<template>
    <SiteHeader 
      :headerNavigation="navigationMenu"
      :refresh="refresh"
    />
    <div class="relative z-1">
      <slot></slot>
    </div>
    
    <LazyNewsletter />

    <LazySiteFooter 
      hydrate-on-visible 
      ref="footerRef"
      :navigation="navigationMenu"
      :globals="siteData?.globals || {}"
    />
    <LazyWishlistSidebar />
    
</template>
