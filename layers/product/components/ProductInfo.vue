<script setup lang="ts">
import type { Product, CustomProductWithStockFromRedis, OrderLine } from '~/graphql'
import {
    SfButton,
    SfIconShoppingCart,
    SfIconShoppingCartCheckout,
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

const quantitySelectorValue = ref(1)

const handleCartAdd = async () => {
  let id = productVariant?.value.id
  if (!productVariant.value.combinationInfoVariant) {
    id = Number(productVariant?.value?.id)
  }
  await cartAdd(id, quantitySelectorValue.value)
}

const productsInCart = computed(() => {
  return (
    cart.value?.order?.websiteOrderLine?.find(
      (orderLine: OrderLine) =>
        orderLine.product?.id === productVariant?.value.id,
    )?.quantity || 0
  )
})

const isStock = computed(() => {
    return Boolean(productVariant.value?.stock > 0 || productVariant.value?.combinationInfoVariant['allow_out_of_stock_orders'])
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
            class="grow"
        />
        <h1
            class="font-bold typography-headline-2 break-word !normal-case"
            data-testid="product-name"
        >
            {{ productVariant?.name }}
        </h1>
            
        <span class="block text-sm my-1">
            {{ productVariant?.sku }}
        </span>
        <UiProductRating
            class="block"
            :rating="productTemplate?.rating || 0"
            :ratingCount="productTemplate?.ratingCount || 0"
        />
        <div class="my-4">
            <ClientOnly>
                <UiProductStockStatus
                    class="mb-4"
                    :stock="productVariant?.stock"
                    :productId="productVariant?.id"
                    :showAvailability="productVariant?.combinationInfoVariant['show_availability']"
                    :availableThreshold="productVariant?.combinationInfoVariant['available_threshold']"
                    :isStock="isStock"
                    :allowOutOfStockOrder="productVariant?.combinationInfoVariant['allow_out_of_stock_orders'] || false"
                />
            </ClientOnly>
        </div>
        <div class="py-4 my-4 border-gray-200 border-y">
            <div class="flex items-center justify-between mb-4">
                <UiProductPrice
                    :regularPrice
                    :specialPrice
                    :hasDiscountedPrice="productVariant?.combinationInfoVariant?.has_discounted_price || false"
                    :discPercentage="productVariant?.combinationInfoVariant?.discount_perc || 0"
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
        </div>
        <div class="flex flex-col">
            <ClientOnly>
                <LazyUiProductDelivery

                />
            </ClientOnly>
        </div>
    </div>
</template>