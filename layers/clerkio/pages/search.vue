<script setup lang="ts">
import {
  SfButton,
  SfIconTune,
  useDisclosure,
  SfLoaderCircular,
} from "@storefront-ui/vue";
import type { Product, CustomProductWithStockFromRedis } from "~/graphql";
import ProductCardSkeleton from "~/layers/core/components/ui/ProductCardSkeleton.vue";

const route = useRoute();
const { isOpen, open, close } = useDisclosure();

// searching on Clerk with query params
const {
  loading,
  searchResults,
  stockCount,
  totalItems,
  search
} = useClerkProductSearch(route.fullPath)

const organizedAttributes = ref([])

provide("stockCount", stockCount)

const breadcrumbs = [
  { name: "Home", link: "/" },
  { name: "Search", link: "/" },
];

const maxVisiblePages = useState("search-page-max-visible", () => 1)
const setMaxVisiblePages = (isWide: boolean) =>
  (maxVisiblePages.value = isWide ? 5 : 1)

watch(isWideScreen, (value) => setMaxVisiblePages(value))
watch(isTabletScreen, (value) => {
  if (value && isOpen.value) {
    close()
  }
})


const pagination = computed(() => ({
  currentPage: route?.query?.page ? Number(route.query.page) : 1,
  totalPages: Math.ceil(totalItems.value / 12) || 1,
  totalItems: totalItems.value,
  itemsPerPage: 12,
  pageOptions: [5, 12, 15, 20],
}))

onMounted( () => {
  setMaxVisiblePages(isWideScreen.value);
  watch(
    () => route,
    async () => {
      hasLoadedOnce.value = false
      search( {
        query: String(route.query.search || '')
      })
    },
    { deep: true, immediate: true }
  )
})

search( {
  query: String(route.query.search || '')
})

const hasLoadedOnce = ref(false)

watch(loading, (val) => {
  if (!val) {
    hasLoadedOnce.value = true
  }
})
</script>
<template>
  <main 
      class="w-full narrow-container bg-white mb-20"
      data-testid="search-layout"
  >
  <div class="pb-20" :key="route.fullPath">
    <UiBreadcrumb :breadcrumbs="breadcrumbs" class="self-start mt-5 mb-5" />
    <h1
      v-if="route.query.search"
      class="font-bold typography-headline-3 md:typography-headline-2 mb-10"
    >
      Results for "{{ route.query.search }}"
    </h1>
    <div class="grid grid-cols-12 lg:gap-x-6">
      <div class="col-span-12 lg:col-span-4 xl:col-span-3">
        <CategoryFilterSidebar
          class="hidden lg:block"
          :attributes="organizedAttributes"
          :categories="[]"
        />
        <LazyCategoryMobileSidebar :is-open="isOpen" @close="close">
          <template #default>
            <CategoryFilterSidebar
              class="block lg:hidden"
              :attributes="organizedAttributes"
              :categories="[]"
              @close="close"
            />
          </template>
        </LazyCategoryMobileSidebar>
      </div>
      <div class="col-span-12 lg:col-span-8 xl:col-span-9">
        <div
          v-if="loading"
          class="w-full text-center"
        >
          <div class="flex justify-between items-center mb-6">
            <span class="font-bold font-headings md:text-lg"
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
            class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8"
          >
            <ProductCardSkeleton
              v-for="n in 12"
              :key="n"
            />
          </section>
        </div>
        <div v-else-if="totalItems > 0">
          <div class="flex justify-between items-center mb-6">
            <span class="font-bold font-headings md:text-lg"
              >{{ totalItems }} Products
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
            class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8"
          >
            <LazyUiProductCard
              v-for="productTemplate in searchResults"
              :key="productTemplate?.id"
              :slug=" mountUrlSlugForProductVariant(productTemplate.firstVariant as Product || productTemplate as Product) || '' "
              :name="productTemplate?.name || ''"
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
              :first-variant="productTemplate as CustomProductWithStockFromRedis"
            />
          </section>

          <LazyUiPagination
            v-if="pagination.totalPages > 1"
            class="mt-5"
            :current-page="pagination.currentPage"
            :total-items="pagination.totalItems"
            :page-size="pagination.itemsPerPage"
            :max-visible-pages="maxVisiblePages"
          />
        </div>
        <CategoryEmptyState
          v-else-if="!loading && route.query.search && hasLoadedOnce && totalItems === 0"
          :page="pagination.currentPage"
        />
      </div>
    </div>
  </div>
  </main>
</template>
