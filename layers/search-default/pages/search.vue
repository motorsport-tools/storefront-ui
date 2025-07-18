<script setup lang="ts">
import {
  SfButton,
  SfIconTune,
  useDisclosure,
  SfLoaderCircular,
} from "@storefront-ui/vue";
import type { Product } from "~/graphql";

const route = useRoute();
const { isOpen, open, close } = useDisclosure();

// searching on odoo with query params
const {
  loading,
  totalItems,
  organizedAttributes,
  loadProductTemplateList,
  productTemplateList,
  stockCount
} = useProductTemplateList(route.fullPath);

provide("stockCount", stockCount);

const { getFacetsFromURL } = useUiHelpers();
const { getRegularPrice, getSpecialPrice } = useProductAttributes();

const breadcrumbs = [
  { name: "Home", link: "/" },
  { name: "Search", link: "/" },
];

const maxVisiblePages = useState("search-page-max-visible", () => 1);
const setMaxVisiblePages = (isWide: boolean) =>
  (maxVisiblePages.value = isWide ? 5 : 1);

watch(isWideScreen, (value) => setMaxVisiblePages(value));
watch(isTabletScreen, (value) => {
  if (value && isOpen.value) {
    close();
  }
});

watch(
  () => route,
  async () => {
    await loadProductTemplateList(getFacetsFromURL(route.query));
  },
  { deep: true, immediate: true }
);

const pagination = computed(() => ({
  currentPage: route?.query?.page ? Number(route.query.page) : 1,
  totalPages: Math.ceil(totalItems.value / 12) || 1,
  totalItems: totalItems.value,
  itemsPerPage: 12,
  pageOptions: [5, 12, 15, 20],
}));

onMounted(() => {
  setMaxVisiblePages(isWideScreen.value);
})

await loadProductTemplateList(getFacetsFromURL(route.query))
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
          <SfLoaderCircular
            size="xl"
            class="mt-[160px]"
          />
        </div>
        <div v-else-if="productTemplateList.length > 0">
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
              v-for="productTemplate in productTemplateList"
              :key="productTemplate.id"
              :name="productTemplate?.name || ''"
              loading="eager"
              :slug="
                mountUrlSlugForProductVariant(
                  (productTemplate.firstVariant || productTemplate) as Product
                )
              "
              :image-url="
                $getImage(
                  String(productTemplate.image),
                  370,
                  370,
                  String(productTemplate.imageFilename)
                )
              "
              :image-alt="productTemplate?.name || ''"
              :regular-price="
                getRegularPrice(productTemplate.firstVariant as Product)
              "
              :special-price="
                getSpecialPrice(productTemplate.firstVariant as Product)
              "
              :rating-count="123"
              :rating="Number(4)"
              :first-variant="productTemplate.firstVariant as Product"
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
          v-if="!loading && totalItems === 0"
          :page="pagination.currentPage"
        />
      </div>
    </div>
  </div>
  </main>
</template>
