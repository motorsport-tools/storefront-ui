<script setup lang="ts">
import {
  SfButton,
  SfChip,
  SfCounter,
  SfIconCompareArrows,
  SfIconFavorite,
  SfIconFavoriteFilled,
  SfIconPackage,
  SfIconSafetyCheck,
  SfIconSell,
  SfIconShoppingCart,
  SfIconShoppingCartCheckout,
  SfIconWarehouse,
  SfLink,
  SfLoaderCircular,
  SfRating,
  SfThumbnail,
} from '@storefront-ui/vue'
import type { LocationQueryRaw } from 'vue-router'
import type { CustomProductWithStockFromRedis, ImageGalleryItem, OrderLine, Product } from '~/graphql'
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'

const route = useRoute()

const cleanPath = computed(() => route?.path?.replace(/\/$/, ''))
const cleanFullPath = computed(() => route?.fullPath?.replace(/\/$/, ''))

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
const { wishlistAddItem, isInWishlist, wishlistRemoveItem } = useWishlist()
const { cart, cartAdd } = useCart()

useHead(generateSeo<SeoEntity>(productVariant.value, 'Product'))

const params = computed(() => ({
  combinationId: Object.values(route.query)?.map(value =>
    parseInt(value as string),
  ),
  productTemplateId: productTemplate?.value?.id,
}))

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
const quantitySelectorValue = ref(1)

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

const tomorrow = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toDateString().slice(0, 10)
})

const productsInCart = computed(() => {
  return (
    cart.value?.order?.websiteOrderLine?.find(
      (orderLine: OrderLine) =>
        orderLine.product?.id === productVariant?.value.id,
    )?.quantity || 0
  )
})

const handleCartAdd = async () => {
  let id = productVariant?.value.id
  if (!productVariant.value.combinationInfoVariant) {
    id = Number(productVariant?.value?.id)
  }
  await cartAdd(id, quantitySelectorValue.value)
}

const handleWishlistAddItem = async (firstVariant: CustomProductWithStockFromRedis) => {
  await wishlistAddItem(firstVariant.id)
}

const handleWishlistRemoveItem = async (firstVariant: CustomProductWithStockFromRedis) => {
  await wishlistRemoveItem(firstVariant.id)
}

watch(
  () => params.value,
  async (newValue, oldValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      await loadProductVariant(newValue)
      addProductToRecentViews(productTemplate.value?.id)
    }
  },
  { deep: true },
)

const { getMainImage, getThumbs } = useProductGetters(productVariant)
const mainImage = computed(() => getMainImage(380, 505))
const thumbs = computed(() => getThumbs(78, 78))

await loadProductTemplate({ slug: cleanPath.value })
if (productTemplate.value?.id) {
  await loadProductVariant({
    combinationId: Object.values(route.query)?.map(value =>
      parseInt(value as string),
    ),
    productTemplateId: productTemplate?.value?.id,
  })
}
</script>

<template>
    <main 
        class="w-full narrow-container mb-20"
        data-testid="product-page"
    >
        <NuxtErrorBoundary>
        <div>
        <UiBreadcrumb
            v-if="productTemplate?.breadcrumb?.length"
            :breadcrumbs="productTemplate?.breadcrumb"
            class="self-start mt-5 mb-10"
        />
        <div
            v-if="loadingProductTemplate"
            class="w-full flex flex-col items-center justify-center min-h-[60vh]"
        >
            <SfLoaderCircular
            size="xl"
            class="my-32"
            />
        </div>
        <div
            v-else-if="productVariant.id"
            class="md:grid grid-areas-product-page grid-cols-product-page gap-x-6"
        >
            <section class="grid-in-left-top md:h-full xl:max-h-[700px]">
                <LazyUiGallery
                    :main-image="mainImage || {} as ImageGalleryItem"
                    :thumbs="thumbs"
                />
            </section>
            <section class="col-span-5 grid-in-right md:mb-0">
            <div
                class="p-6 xl:p-6 md:border md:border-neutral-100 md:shadow-lg md:rounded-md md:sticky md:top-20"
                data-testid="purchase-card"
            >
                <span 
                    class="clerk"
                    data-api="log/product"
                    :data-product="productVariant.id">
                </span>
                <div
                class="inline-flex items-center justify-center font-medium rounded-none bg-secondary-800 text-sm p-1.5 gap-1 mb-4"
                >
                <SfIconSell
                    color="white"
                    size="sm"
                    class="mr-1"
                />
                <span class="mr-1 text-white">{{ $t(`sale`) }}</span>
                </div>
                <h1
                class="mb-1 font-bold typography-headline-4"
                data-testid="product-name"
                >
                {{ productVariant?.name }}
                </h1>
                <div
                v-if="
                    productVariant
                    && productVariant?.combinationInfoVariant?.has_discounted_price
                "
                class="my-1"
                >
                <span
                    class="mr-2 text-secondary-700 font-bold font-headings text-2xl"
                    data-testid="price"
                >
                    {{ $currency(getSpecialPrice) }}
                </span>
                <span class="text-base font-normal text-neutral-500 line-through">
                    {{ $currency(getRegularPrice) }}
                </span>
                </div>
                <div
                v-else
                class="my-1"
                >
                <span
                    class="mr-2 text-secondary-700 font-bold font-headings text-2xl"
                    data-testid="price"
                >
                    {{ $currency(getRegularPrice) }}
                </span>
                </div>
                <div class="inline-flex items-center mt-4 mb-2">
                <SfRating
                    size="xs"
                    :value="4"
                    :max="5"
                />
                <SfCounter
                    class="ml-1"
                    size="xs"
                >
                    26
                </SfCounter>
                <SfLink
                    href="#"
                    variant="secondary"
                    class="ml-2 text-xs text-neutral-500"
                >
                    26 reviews
                </SfLink>
                </div>
                <p
                class="mb-4 font-normal typography-text-sm"
                data-testid="product-description"
                >
                {{ productVariant?.description }}
                </p>
                <div class="py-4 mb-4 border-gray-200 border-y">
                <div
                    v-show="productsInCart"
                    class="w-full mb-4 bg-primary-200 p-2 rounded-md text-center text-primary-700"
                >
                    <SfIconShoppingCartCheckout />
                    {{ productsInCart }} products in cart
                </div>
                <div class="flex flex-col md:flex-row flex-wrap gap-4">
                    <UiQuantitySelector
                    v-model="quantitySelectorValue"
                    :value="quantitySelectorValue"
                    class="min-w-[145px] flex-grow flex-shrink-0 basis-0"
                    />
                    <SfButton
                    :disabled="loadingProductVariant || productVariant.stock <= 0"
                    type="button"
                    size="lg"
                    class="flex-grow-[2] flex-shrink basis-auto whitespace-nowrap"
                    @click="handleCartAdd"
                    >
                    <template #prefix>
                        <SfIconShoppingCart size="sm" />
                    </template>
                    {{ $t("addToCart") }}
                    </SfButton>
                </div>
                <div class="flex justify-center mt-4 gap-x-4">
                    <SfButton
                    type="button"
                    size="sm"
                    variant="tertiary"
                    :class="
                        productVariant?.isInWishlist ? 'bg-primary-100' : 'bg-white'
                    "
                    @click="
                        isInWishlist(productVariant?.id as number)
                        ? handleWishlistRemoveItem(productVariant)
                        : handleWishlistAddItem(productVariant)
                    "
                    >
                    <SfIconFavoriteFilled
                        v-show="isInWishlist(productVariant?.id as number)"
                        size="sm"
                    />
                    <SfIconFavorite
                        v-show="!isInWishlist(productVariant?.id as number)"
                        size="sm"
                    />
                    {{
                        isInWishlist(productVariant?.id as number)
                        ? $t('wishlist.removeFromWishlist')
                        : $t('wishlist.addToWishlist')
                    }}
                    </SfButton>
                </div>
                </div>
                <div class="flex first:mt-4">
                <SfIconPackage
                    size="sm"
                    class="flex-shrink-0 mr-1 text-neutral-500"
                />
                <p class="text-sm">
                    <i18n-t
                    keypath="additionalInfo.shipping"
                    scope="global"
                    >
                    <template #date>
                        {{ tomorrow }}
                    </template>
                    <template #addAddress>
                        <SfLink
                        class="ml-1"
                        href="#"
                        variant="secondary"
                        >
                        {{ $t("additionalInfo.addAddress") }}
                        </SfLink>
                    </template>
                    </i18n-t>
                </p>
                </div>
                <div class="flex mt-4">
                <SfIconWarehouse
                    size="sm"
                    class="flex-shrink-0 mr-1 text-neutral-500"
                />
                <p class="text-sm">
                    <i18n-t
                    keypath="additionalInfo.pickup"
                    scope="global"
                    >
                    <template #checkAvailability>
                        <SfLink
                        class="ml-1"
                        href="#"
                        variant="secondary"
                        >
                        {{ $t("additionalInfo.checkAvailability") }}
                        </SfLink>
                    </template>
                    </i18n-t>
                </p>
                </div>
                <div class="flex mt-4">
                <SfIconSafetyCheck
                    size="sm"
                    class="flex-shrink-0 mr-1 text-neutral-500"
                />
                <i18n-t
                    keypath="additionalInfo.returns"
                    scope="global"
                >
                    <template #details>
                    <SfLink
                        class="ml-1"
                        href="#"
                        variant="secondary"
                    >
                        {{ $t("additionalInfo.details") }}
                    </SfLink>
                    </template>
                </i18n-t>
                </div>
            </div>
            </section>
            <section class="grid-in-left-bottom md:mt-8">
            <UiDivider class="mt-10 mb-6" />
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
                <p>
                    {{ productVariant?.description }}
                </p>
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
                    Lightweight • Non slip • Flexible outsole • Easy to wear on and
                    off
                </p>
                </UiAccordionItem>
            </div>
            </section>
            <UiDivider class="mt-4 mb-2" />
        </div>
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
        </div>
        <template #error="{ error }">
            <ErrorDisplay :msg="$t('error.404')"/>
        </template>
    </NuxtErrorBoundary>
    </main>
</template>