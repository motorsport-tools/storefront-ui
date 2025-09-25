<script setup lang="ts">
import {
    SfButton,
    SfSelect,
    SfIconTune,
    useDisclosure
} from "@storefront-ui/vue"
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'
import ProductCardSkeleton from "~/layers/core/components/ui/ProductCardSkeleton.vue";
import type { Product, CustomProductWithStockFromRedis } from "~/graphql";
const route = useRoute()
const { open, close, isOpen } = useDisclosure()
const { loadCategory, category } = useCategory()
const {
    query,
    results,
    nonFacetKeys,
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
} = useProductSearch()

const searchTitle = computed( () => {
    return `Category: ${category.value.name}`
})

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
            await loadCategory({ slug: String(newSlug) })
            fetchSearch(category.value.id)
        }
    },
    { immediate: true },
)

watch(
    () => route.query,
    newQuery => {
        //query.value = newQuery.search?.toString() || ''
        sort.value = newQuery.sort?.toString() || 'default'
        page.value = parseInt(newQuery.page?.toString() || '1')

        selectedFacets.value = {}
        for (const [key, value] of Object.entries(newQuery)) {
            if (nonFacetKeys.includes(key)) continue
            if (typeof value === 'string') {
                selectedFacets.value[key] = value.split(',')
            }
        }

        fetchSearch(category.value.id)
    },
    { immediate: true, deep: true }
)

useHead(generateSeo<SeoEntity>(category.value, 'Category'))

setMaxVisiblePages(isWideScreen.value)
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
            <UiBreadcrumb
                :breadcrumbs="category.breadcrumb"
                class="self-start mt-5 mb-5"
            />
            <h1
                class="font-bold typography-headline-3 md:typography-headline-2 mb-10"
            >
                {{ searchTitle }}
            </h1>
            <div class="grid grid-cols-12 lg:gap-x-6">
                    <FilterSidebar 
                    class="hidden lg:block col-span-12 lg:col-span-4 xl:col-span-3"
                    :availableFacets="availableFacets"
                    :selectedFacets="selectedFacets"
                    :setFacet="setFacet"
                    :facetStats="facetStats"
                    :filterCount="filterCount"
                    :loading="loading"
                    :isCategory="true"
                />
                <LazyCategoryMobileSidebar :is-open="isOpen" @close="close">
                    <template #default>
                        <FilterSidebar 
                            class="block lg:hidden"
                            :availableFacets="availableFacets"
                            :selectedFacets="selectedFacets"
                            :setFacet="setFacet"
                            :facetStats="facetStats"
                            :filterCount="filterCount"
                            :loading="loading"
                            @close="close"
                            :isCategory="true"
                        />
                    </template>
                </LazyCategoryMobileSidebar>
                <div class="col-span-12 lg:col-span-8 xl:col-span-9">
                    <div class="flex justify-start items-center mb-6">
                        <SfSelect
                            v-model="sort"
                            placeholder="Select sorting"
                            :aria-label="$t('sortBy')"
                            @update:model-value="setSort"
                            class="min-w-[300px] mr-4"
                        >
                            <option
                                v-for="{ id, value, attrName } in sortByOptions"
                                :key="id"
                                :selected="sort === value"
                                :value="value"
                            >
                                {{$t('sortBy') }}: {{ attrName }}
                            </option>
                        </SfSelect>
                        
                        <SfSelect
                            v-model="limit"
                            aria-label="Select per-page"
                            placeholder="Per page"
                            @update:model-value="setLimit"
                            class="min-w-[120px] mr-2"
                        >
                            <option 
                                v-for="l in limitOptions"
                                :key="l"
                                :selected="limit === String(l)"
                                :value="String(l)"
                            >
                                {{$t('show')}}: {{ String(l) }}
                            </option>
                        </SfSelect>
                        <span class="text-[12px]">
                            {{ $t('productsPerPage') }}
                        </span>
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <span v-if="!loading" class="font-bold font-headings md:text-sm"
                        >{{ total }} Products
                        </span>
                        <span v-if="loading" class="font-bold font-headings md:text-sm"
                        >Loading Products
                        </span>
                        <SfButton
                        variant="tertiary"
                        class="lg:hidden whitespace-nowrap"
                        @click="open"
                        >
                        <template #prefix>
                            <SfIconTune />
                        </template>
                        Filter
                        </SfButton>
                    </div>
                    <section
                        :key="route.hash"
                        class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8"
                    >
                        <ProductCardSkeleton v-if="loading" v-for="i in Number(limit)" :key="i" />
                
                        <LazyUiProductCard
                            v-else-if="results.length > 0"
                            v-for="productTemplate in results"
                            :key="productTemplate?.id"
                            :slug=" mountUrlSlugForProductVariant(productTemplate.firstVariant as Product || productTemplate as Product) || '' "
                            :name="productTemplate?.name || ''"
                            :sku="productTemplate?.sku || ''"
                            :image-url="
                                $getImage(
                                `${String(productTemplate.image_slug)}`,
                                370,
                                370,
                                String(productTemplate.imageFilename),
                                )
                            "
                            :brand="productTemplate?.brand"
                            :image-alt="productTemplate?.name || ''"
                            :regular-price="productTemplate.on_sale ? productTemplate.list_price : 0"
                            :special-price="productTemplate.price"
                            :is-in-wishlist="productTemplate?.isInWishlist || false"
                            :rating-count="productTemplate.ratingCount || 0"
                            :rating="productTemplate.rating || 0"
                            :first-variant="productTemplate as unknown as CustomProductWithStockFromRedis"
                        />
                        <CategoryEmptyState
                            v-else
                            :page="page"
                        />
                    </section>
                    <LazyUiPagination
                        v-if="totalPages > 1"
                        class="mt-5"
                        :current-page="page"
                        :total-items="total"
                        :page-size="limit"
                        :max-visible-pages="maxVisiblePages"   
                    />
                </div>
            </div>
        </div>
        <svg class="absolute w-0 h-0 select-none pointer-events-none">
            <symbol id="check-4" viewbox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
            </symbol>
        </svg>
    </main>
</template>