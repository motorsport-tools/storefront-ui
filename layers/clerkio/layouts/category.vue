<script lang="ts" setup>
import type { Category } from "~/graphql";
const { category } = useCategoryData()

const route =  useRoute()
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
    <CategoryProvider 
        :key="`category-${category?.id}`"
        index-name="categories" 
        :category="category"
    >
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