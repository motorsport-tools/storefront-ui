<script lang="ts" setup>
defineProps({
  error: Object
})

const {
	data: siteData,
	error: siteError,
	refresh,
} = await useFetch('/api/site-data', {
	key: 'site-data',
})

const { isVisualEditingEnabled, apply } = useVisualEditing()

const navigation = ref<HTMLElement>()
const footer = useTemplateRef('footerRef')

function onNavigationReady(el: HTMLElement) {
  navigation.value = el
  console.log('Navigation ref from child:', navigation.value)

  // now safe to call your apply or refresh logic
  apply({
    elements: [navigation.value as HTMLElement, footer.value?.footerRef as HTMLElement],
    onSaved: () => {
      refresh()
    },
  })
}
</script>

<template>
    <!--
    <TheHeader />
    -->
    <SiteHeader @navigationReady="onNavigationReady" />
    <div>
      <slot></slot>
    </div>
    
    <LazyNewsletter />
    <!--
    <LazyBottomNavbar hydrate-on-visible />
    -->
    <LazyTheFooter 
      hydrate-on-visible 
      ref="footerRef"
      :navigation="siteData?.footerNavigation || []"
      :globals="siteData?.globals || []"
    />
    <WishlistSidebar />
    
</template>
