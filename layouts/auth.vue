<script setup lang="ts">
defineProps({
  error: Object,
  heading: String
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
      :navigation="siteData?.footerNavigation || []"
      :globals="siteData?.globals || {}"
    />
    <LazyWishlistSidebar />
</template>
