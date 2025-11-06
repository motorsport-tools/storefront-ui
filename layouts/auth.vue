<script setup lang="ts">
defineProps({
  error: Object,
  heading: String
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
const footer = useTemplateRef('footerRef')
</script>

<template>
  <SiteHeader 
      :headerNavigation="navigationMenu"
      :refresh="refresh"
    />
  <div class="relative z-1">
    <main
      :class="[
        'w-full narrow-container bg-white mb-20 px-4 pt-4 pb-20 md:px-0 md:mt-4',
        { 'md:mb-8': heading },
        heading ? 'md:max-w-[630px]' : 'md:max-w-[677px]',
      ]"
    >
      <h1
        v-if="heading"
        class="font-bold mb-10 typography-headline-3 md:typography-headline-2"
      >
        {{ heading }}
      </h1>
      <slot />
    </main>
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
