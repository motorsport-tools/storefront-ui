<script setup lang="ts">
import {
    SfButton,
    SfSelect,
    SfIconTune,
    useDisclosure
} from "@storefront-ui/vue"
import ProductCardSkeleton from "~/layers/core/components/ui/ProductCardSkeleton.vue";
import type { Product, CustomProductWithStockFromRedis } from "~/graphql";
const route = useRoute()
const { open, close, isOpen } = useDisclosure()
const { loadCategory, category } = useCategory()
const {
    query,
    results,
    availableFacets,
    selectedFacets,
    facetStats,
    filterCount,
    totalPages,
    page,
    limit,
    total,
    sort,
    loading,
    sortByOptions,
    limitOptions,
    setFacet,
    setLimit,
    setSort,
    fetchSearch,
} = useProductSearch(category.value?.id)
const maxVisiblePages = useState('category-max-visible-pages', () => 1)
const setMaxVisiblePages = (isWide: boolean) =>
  (maxVisiblePages.value = isWide ? 5 : 1)

watch(isWideScreen, (value) => setMaxVisiblePages(value))
watch(isTabletScreen, (value) => {
  if (value && isOpen.value) {
    close()
  }
})

watch(
    () => route.path,
    async (newSlug, oldSlug) => {
        if (newSlug && newSlug !== oldSlug) {
            console.log('New Slug:', newSlug)
            await loadCategory({ slug: String(newSlug) })
            fetchSearch()
        }
    },
    { immediate: true },
)

</script>
<template>
    <main 
        class="w-full narrow-container bg-white mb-20"
        data-testid="search-layout"
    >
        <div
            :key="route.fullPath" 
            class="pb-20"
        >

            <div class="grid grid-cols-12 lg:gap-x-6">
                <aside
                    class="hidden lg:block col-span-12 lg:col-span-4 xl:col-span-3"
                >
                    Sidebar
                </aside>
                <div class="col-span-12 lg:col-span-8 xl:col-span-9">
                    <div class="flex justify-start items-center mb-6">
                        {{ category.id }} - {{ category.name }}
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        2nd Line of Filters loading/count
                    </div>
                    <section
                        :key="route.hash"
                        class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8"
                    >
                        <pre>{{ results }}</pre>
                    </section>
                </div>
            </div>
        </div>
    </main>
</template>