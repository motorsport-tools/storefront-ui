<script lang="ts" setup>
defineProps({
  error: Object
})

const { isVisualEditingEnabled, apply } = useVisualEditing()

const {
    data: siteData,
    error: siteError,
    refresh,
} = await useFetch('/api/site-data', {
    key: 'site-data',
    headers: isVisualEditingEnabled ? { 'x-invalidate': '1' } : {},
    immediate: true,
})


const navigation = ref<HTMLElement>()
const footer = useTemplateRef('footerRef')

function onNavigationReady(el: HTMLElement) {
  if(!isVisualEditingEnabled) {
    console.log('Visual not Enabled')
    return
  } 
  navigation.value = el
  apply({
    elements: [navigation.value as HTMLElement, footer.value?.footerRef as HTMLElement],
    onSaved: () => {
      refresh()
    },
  })
}
</script>

<template>
    <SiteHeader 
      :headerNavigation="siteData?.headerNavigation"
      @navigationReady="onNavigationReady" 
    />
    <div class="relative z-1">
      <slot></slot>
    </div>
    
    <LazyNewsletter />

    <LazySiteFooter 
      hydrate-on-visible 
      ref="footerRef"
      :navigation="siteData?.footerNavigation || []"
      :globals="siteData?.globals || {}"
    />
    <LazyWishlistSidebar />
    
</template>
