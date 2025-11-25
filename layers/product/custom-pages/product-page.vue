<script setup lang="ts">
import {
  SfLoaderCircular,
} from '@storefront-ui/vue'
import type { CustomProductWithStockFromRedis } from '~/graphql'
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'

const route = useRoute()

const cleanPath = computed(() => route?.path?.replace(/\/$/, '').toLowerCase().trim())
const cleanFullPath = computed(() => route?.fullPath?.replace(/\/$/, '').toLowerCase().trim())

definePageMeta({
  layout: 'default'
})

useHead({
    script: [
        {
            src: 'https://js.stripe.com/v3/',
            type: 'text/javascript',
            async: true,
        },
    ]
})

const {
  loadProductTemplate,
  productTemplate,
  loadingProductTemplate,
  getAllAmounts,
  getAllColors,
  getAllMaterials,
  getAllSizes,
} = useProductTemplate(cleanPath.value)
const {
  loadProductVariant,
  loadingProductVariant,
  productVariant,
  getRegularPrice,
  getSpecialPrice,
} = useProductVariant(cleanFullPath.value)
const { addProductToRecentViews } = useRecentViewProducts()

useHead(generateSeo<SeoEntity>(productVariant.value, 'Product'))

const productDetailsOpen = ref(true)

const { getThumbs } = useProductGetters(productVariant as Ref< CustomProductWithStockFromRedis>)
const thumbs = computed(() => getThumbs(78, 78))


watch(
  () => cleanPath.value,
  async (slug) => {
    if (!slug) {
        return;
    }

    await loadProductTemplate({ slug })
  },
  { immediate: true }
)


watch(
  [productTemplate, () => route.query],
  async ([template, query]) => {
    if (!template?.id) {
        return
    }
    
    if (import.meta.server) {
        return
    }
    
    await loadProductVariant({
        combinationId: Object.values(query)?.map(value =>
            parseInt(value as string)
        ).filter(Boolean),
        productTemplateId: template.id,
    })
    addProductToRecentViews(template.id)

  },
  { immediate: true, deep: true }
)

const isLoadingPage = computed(() => {
  if (import.meta.server) {
    return loadingProductTemplate.value
  }
  return loadingProductTemplate.value || loadingProductVariant.value
})

const hasProductData = computed(() => {
    return productTemplate.value?.id && (import.meta.server || productVariant.value?.id)
})

const breadcrumbs = computed(() => {
    const p = productTemplate.value
    if (!p?.breadcrumb || !p?.name) return []  
    const bc = typeof p.breadcrumb === 'string' ? JSON.parse(p.breadcrumb) : p.breadcrumb
    return [...bc, { name: p.name }]
})
</script>

<template>
    <main 
        class="w-full narrow-container mb-20 pt-6"
        data-testid="product-page"
    >
        <NuxtErrorBoundary>
            <div>
                <div class="flex md:flex-row mt-5 mb-10">
                    <UiBreadcrumb
                        v-if="breadcrumbs.length"
                        :breadcrumbs="breadcrumbs"
                        class="grow self-start"
                    />
                    <LazyUiProductWishlistButton
                        :productVariant="productVariant"
                    />
                </div>
                <div
                    v-if="isLoadingPage"
                    class="w-full flex flex-col items-center justify-center min-h-[60vh]"
                >
                    <SfLoaderCircular
                        size="xl"
                        class="my-32"
                    />
                </div>
                <div
                    v-else-if="hasProductData"
                    class="md:grid grid-areas-product-page grid-cols-product-page gap-x-6"
                >
                    <section class="grid-in-left-top md:h-full xl:max-h-[700px]">
                        <LazyUiGallery
                            :thumbs="thumbs"
                        />
                    </section>
                    <section class="col-span-5 grid-in-right md:mb-0">
                        
                        <ProductInfo
                            :productTemplate
                            :productVariant
                            :specialPrice="getSpecialPrice"
                            :regularPrice="getRegularPrice"
                            :loadingProductVariant
                            :getAllAmounts
                        />
                    </section>
                    <section class="grid-in-left-bottom md:mt-8">
                        <UiDivider class="mt-10 mb-6" />
                    
                        <div data-testid="product-accordion">
                            <UiAccordionItem
                                v-model="productDetailsOpen"
                                summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 lg:pl-4 pr-3 flex justify-between items-center"
                            >
                                <template #summary>
                                    <h2
                                        class="font-bold font-headings text-lg leading-6 md:text-2xl"
                                    >
                                        {{ $t("productDetails") }}
                                    </h2>
                                </template>
                                <div v-html="productVariant?.description">
                                </div>
                            </UiAccordionItem>
                            <UiDivider class="my-4" />
                            <UiAccordionItem
                                summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 lg:pl-4 pr-3 flex justify-between items-center"
                            >
                                <template #summary>
                                    <h2
                                        class="font-bold font-headings text-lg leading-6 md:text-2xl"
                                    >
                                        {{ $t("customerReviews") }}
                                    </h2>
                                </template>
                                <p>
                                    This product has not been reviewed yet
                                </p>
                            </UiAccordionItem>
                        </div>
                    </section>
                    <UiDivider class="mt-4 mb-2" />
                </div>
                <div v-else>
                    Claims no data......
                    <br/>{{ hasProductData }}
                </div>
            
                <LazyProductFrequentlyBought
                    :fbt="productTemplate?.frequentlyBoughtTogether"
                    :loading="loadingProductTemplate"
                />
                <LazyProductAlternatives
                    :alt="productTemplate?.alternativeProducts"
                    :loading="loadingProductTemplate"
                />
                <LazyProductRecentlyViewed
                    :loading="loadingProductTemplate"
                />
            </div>
            <template #error="{ error }">
                {{ error }}
                <ErrorDisplay :msg="$t('error.404')"/>
            </template>
        </NuxtErrorBoundary>
    </main>
</template>