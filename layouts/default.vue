<script lang="ts" setup>
defineProps({
  error: Object
})

const {
	siteData,
	siteError,
	refresh,
} = await useSiteGlobals()

const { isVisualEditingEnabled, apply } = useVisualEditing()

const navigation = ref<HTMLElement>()
const footer = useTemplateRef('footerRef')

function onNavigationReady(el: HTMLElement) {
  if(!isVisualEditingEnabled) return
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
    <SiteHeader @navigationReady="onNavigationReady" />
    <div>
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
