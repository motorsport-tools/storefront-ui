<script lang="ts" setup>
const {
	data: siteData,
	error: siteError,
	refresh,
} = await useFetch('/api/site-data', {
	key: 'site-data',
})

const { isVisualEditingEnabled, apply } = useVisualEditing()

const navigation = useTemplateRef('navigationRef')
const footer = useTemplateRef('footerRef')

onMounted(() => {
	if (!isVisualEditingEnabled.value) return;
	apply({
		elements: [navigation.value?.navigationRef as HTMLElement, footer.value?.footerRef as HTMLElement],
		onSaved: () => {
			refresh()
		},
	})
})
</script>

<template>
    <!--
    <TheHeader />
    -->
    <SiteHeader />
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
