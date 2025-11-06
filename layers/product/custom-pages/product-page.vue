<script setup lang="ts">
import {
  SfChip,
  SfLoaderCircular,
  SfThumbnail,
} from '@storefront-ui/vue'
import type { LocationQueryRaw } from 'vue-router'
import type { CustomProductWithStockFromRedis } from '~/graphql'
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'

const route = useRoute()

const cleanPath = computed(() => route?.path?.replace(/\/$/, ''))
const cleanFullPath = computed(() => route?.fullPath?.replace(/\/$/, ''))

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

const selectedSize = computed(() =>
  route.query.Size ? Number(route.query.Size) : getAllSizes?.value?.[0]?.value,
)

const selectedColor = computed(() =>
  route.query.Color
    ? Number(route.query.Color)
    : getAllColors?.value?.[0]?.value,
)

const selectedMaterial = computed(() =>
  route.query.Material
    ? Number(route.query.Material)
    : getAllMaterials?.value?.[0]?.value,
)

const productDetailsOpen = ref(true)

const updateFilter = async (filter: LocationQueryRaw | undefined) => {
  const query: LocationQueryRaw = {}

  if (selectedMaterial.value && selectedMaterial.value !== 0) {
    query.Material = selectedMaterial.value
  }

  if (selectedColor.value && selectedColor.value !== 0) {
    query.Color = selectedColor.value
  }

  if (selectedSize.value && selectedSize.value !== 0) {
    query.Size = selectedSize.value
  }

  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      query[encodeURIComponent(key)] = value
    })
  }

  await navigateTo({ query })
}

const { getThumbs } = useProductGetters(productVariant as Ref< CustomProductWithStockFromRedis>)
const thumbs = computed(() => getThumbs(78, 78))


watch(
  () => cleanPath.value,
  async (slug) => {
    if (!slug) {
        console.log('no slug returning')
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
      console.log('No ID return..')
      return
    }
    console.log('have ID', template.id)
    console.log('have query', query)
    
    await loadProductVariant({
      combinationId: Object.values(query)?.map(value =>
        parseInt(value as string)
      ),
      productTemplateId: template.id,
    })
    addProductToRecentViews(template.id)
  },
  { immediate: true, deep: true }
)

const isLoadingPage = computed(() => {
  const hasTemplate = productTemplate.value?.id
  const hasVariant = productVariant.value?.id
  const isTemplateLoading = loadingProductTemplate.value
  const isVariantLoading = loadingProductVariant.value
  return isTemplateLoading || isVariantLoading || !hasTemplate || !hasVariant
})

const hasProductData = computed(() => {
  return productTemplate.value?.id && productVariant.value?.id
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
                />
            
            </section>
            <section class="grid-in-left-bottom md:mt-8">
            <UiDivider class="mt-10 mb-6" />
            <!-- // Attribue Stuff - Move to own component
            <div
                class="lg:px-4"
                data-testid="product-properties"
            >
                <fieldset
                v-if="getAllSizes && getAllSizes?.length"
                class="pb-4 flex"
                >
                    <legend
                        class="block mb-2 text-base font-medium leading-6 text-neutral-900"
                    >
                        Size
                    </legend>
                    <span
                        v-for="{ label, value } in getAllSizes"
                        :key="value"
                        class="mr-2 mb-2 uppercase"
                    >
                        <SfChip
                        class="min-w-[48px]"
                        size="sm"
                        :v-model="value"
                        :input-props="{
                            onClick: (e) => value == selectedSize && e.preventDefault(),
                        }"
                        :model-value="value == selectedSize"
                        @update:model-value="
                            value != selectedSize
                            && updateFilter({ ['Size']: value.toString() })
                        "
                        >
                        {{ label }}
                        </SfChip>
                    </span>
                </fieldset>
                <fieldset
                    v-if="getAllMaterials && getAllMaterials?.length"
                    class="pb-4 flex"
                >
                    <legend
                        class="block mb-2 text-base font-medium leading-6 text-neutral-900"
                    >
                        Material
                    </legend>
                    <span
                        v-for="{ label, value } in getAllMaterials"
                        :key="value"
                        class="mr-2 mb-2 uppercase"
                    >
                        <SfChip
                        class="min-w-[48px]"
                        size="sm"
                        :v-model="value"
                        :input-props="{
                            onClick: (e) =>
                            value == selectedMaterial && e.preventDefault(),
                        }"
                        :model-value="value == selectedMaterial"
                        @update:model-value="
                            value != selectedMaterial
                            && updateFilter({ ['Material']: value.toString() })
                        "
                        >
                        {{ label }}
                        </SfChip>
                    </span>
                </fieldset>
                <fieldset
                v-if="getAllColors && getAllColors?.length"
                class="pb-2 flex"
                >
                <legend
                    class="block mb-2 text-base font-medium leading-6 text-neutral-900"
                >
                    Color
                </legend>
                <span
                    v-for="{ label, value } in getAllColors"
                    :key="value"
                    class="mr-2 mb-2 uppercase"
                >
                    <SfChip
                    class="min-w-[48px]"
                    size="sm"
                    :v-model="value"
                    :input-props="{
                        onClick: (e) =>
                        value == selectedColor && e.preventDefault(),
                    }"
                    :model-value="value == selectedColor"
                    @update:model-value="
                        value != selectedColor
                        && updateFilter({ ['Color']: value.toString() })
                    "
                    >
                    <template #prefix>
                        <SfThumbnail
                        size="sm"
                        :style="{ background: label }"
                        />
                    </template>
                    {{ label }}
                    </SfChip>
                </span>
                </fieldset>
            </div>
            <UiDivider class="my-4 md:mt-6" />
        -->
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
        <!--
        <section
            v-if="!loadingProductTemplate && productTemplate?.frequentlyBoughtTogether"
            class="lg:mx-4 mt-28"
        >
            <LazyProductSlider
            text="Recommended with this product"
            :product-template-list="productTemplate?.frequentlyBoughtTogether"
            />
        </section>
        <section
            v-if="!loadingProductTemplate && productTemplate?.alternativeProducts"
            class="lg:mx-4 mb-20"
        >
            <LazyProductSlider
            text="Alternative product"
            :product-template-list="productTemplate?.alternativeProducts"
            />
        </section>
        <section
            v-if="!loadingProductTemplate"
            class="lg:mx-4 mb-20"
        >
            <ClientOnly>
            <LazyProductRecentViewSlider
                text="Your recent views"
            />
            </ClientOnly>
        </section>
        -->
        </div>
        <template #error="{ error }">
            {{ error }}
            <ErrorDisplay :msg="$t('error.404')"/>
        </template>
    </NuxtErrorBoundary>
    </main>
</template>