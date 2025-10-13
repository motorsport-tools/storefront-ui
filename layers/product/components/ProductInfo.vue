<script setup lang="ts">
import type { Product, CustomProductWithStockFromRedis, OrderLine } from '~/graphql'
import {
    SfButton,
    SfIconShoppingCart,
    SfIconShoppingCartCheckout,
    SfIconFavoriteFilled,
    SfIconFavorite,
    SfIconPackage,
    SfIconWarehouse,
    SfIconSafetyCheck

} from '@storefront-ui/vue'

interface Props {
    productTemplate: CustomProductWithStockFromRedis,
    productVariant: CustomProductWithStockFromRedis
    specialPrice: number,
    regularPrice: number,
    loadingProductVariant: boolean,
}
const props = defineProps<Props>()

const { productTemplate, productVariant } = toRefs(props)

const { cart, cartAdd } = useCart()
const { wishlistAddItem, isInWishlist, wishlistRemoveItem } = useWishlist()

const quantitySelectorValue = ref(1)

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

const isStock = computed(() => {
    return productVariant.value?.stock > 0 || productVariant.value?.combinationInfoVariant['allow_out_of_stock_orders']
})

const maxQty = computed(() => {
    if(productVariant.value?.combinationInfoVariant['allow_out_of_stock_orders']) {
        return 999
    } else {
        return productVariant.value.stock || 0
    }
})
</script>
<template>
    <div
        class="p-6 xl:p-6 md:border md:border-neutral-100 md:shadow-lg md:rounded-md md:sticky md:top-20"
        data-testid="purchase-card"
    >
        <span 
            class="clerk"
            data-api="log/product"
            :data-product="productTemplate.id">
        </span>
        <UiProductCardRibbon
            :isOnSale="productVariant
            && productVariant?.combinationInfoVariant?.has_discounted_price"
            size="sm"
        />
        <h1
            class="font-bold typography-headline-2 !normal-case"
            data-testid="product-name"
        >
            {{ productVariant?.name }}
        </h1>
        <div class="flex flex-col">
            <span class="block text-sm my-1">
                {{ productVariant?.sku }}
            </span>
            <UiProductRating
                :rating="productTemplate?.rating || 0"
                :ratingCount="productTemplate?.ratingCount || 0"
            />
        </div>
        <div class="my-4">
            <ClientOnly>
                <UiProductStockStatus
                    class="mb-4"
                    :stock="productVariant?.stock"
                    :showAvailability="productVariant?.combinationInfoVariant['show_availability']"
                    :availableThreshold="productVariant?.combinationInfoVariant['available_threshold']"
                    :isStock="isStock"
                />
            </ClientOnly>
        </div>
        <div class="py-4 my-4 border-gray-200 border-y">
            <div class="flex align-center justify-between mb-4">
                <UiProductPrice
                    class="my-1"
                    :regularPrice
                    :specialPrice
                    :hasDiscountedPrice="productVariant?.combinationInfoVariant?.has_discounted_price || false"
                />
                <UiQuantitySelector
                    v-model="quantitySelectorValue"
                    :value="quantitySelectorValue"
                    :maxQty="maxQty"
                    class="max-w-[145px] flex-grow flex-shrink-0 basis-0"
                />
            </div>
            <ClientOnly>
                <LazyUiStripeProductMessage
                    class="mt-2 mb-4"
                    :specialPrice
                    :regularPrice
                />
            </ClientOnly>
            <div
                v-show="productsInCart"
                class="w-full mb-4 bg-green-200 p-2 rounded-md text-center text-neutral-700"
            >
                <SfIconShoppingCartCheckout />
                {{ productsInCart }} {{ $t('cartProductsIn') }}
            </div>
            <div class="flex flex-col md:flex-row flex-wrap gap-4">
                <SfButton
                    :disabled="loadingProductVariant || !isStock"
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
</template>