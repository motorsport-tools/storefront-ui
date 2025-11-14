<script lang="ts" setup>
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

const { loadCategory, category } = useCategory()
const route = useRoute()

watch(
    [() => route.path],
    async ([newPath], [oldPath]) => {

        if(newPath && newPath !== oldPath) {
            await loadCategory({ slug: String(newPath) })
            console.log('New category Loaded:', category.value.name)
        }
    },
    { immediate: true, deep: true }
)
</script>
<template>
    <CategoryProvider index-name="categories" :category="category">
        <SiteHeader 
        :headerNavigation="navigationMenu"
        :refresh="refresh"
        >
            <template #search>

            </template>
        </SiteHeader>
        <div class="relative z-1">
            <slot></slot>
        </div>
    </CategoryProvider>
    <LazyNewsletter />

    <LazySiteFooter 
      hydrate-on-visible 
      ref="footerRef"
      :navigation="navigationMenu"
      :globals="siteData?.globals || {}"
    />
    <LazyWishlistSidebar />
</template>