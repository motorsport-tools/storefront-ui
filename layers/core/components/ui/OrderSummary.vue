<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';
const { cart, totalItemsInCart, cartHasDiscount  } = useCart();

const mergedCoupons = computed(() => {
  if(cart.value?.order?.orderLines) {
    const lineCoupons = cart.value?.order?.orderLines
      .filter(line => line.isRewardLine)
      .flatMap(line => {
        if (line.coupon && line.coupon.length > 0) {
          return line.coupon
        } else {
          return {
            id: line.id,
            name: line?.product?.name,
            priceSubtotal: line.priceSubtotal,
            isLine: true,
          }
        }
      }) 

      console.log(lineCoupons)
    return [...cart.value?.order?.coupons || [], ...lineCoupons]
  }
  return []
})

const amountDiscounts = computed(() => {
  if(cart.value?.order?.orderLines) {
    return cart.value?.order?.orderLines.filter(l => l.isRewardLine)
    .reduce((sum, line) => sum + (line.priceSubtotal || 0), 0)
  }
  return 0
})

const amountSubtotal = computed(() => {
  return Number(cart.value?.order?.amountSubtotal || 0) + Number(cart.value?.order?.shippingMethod?.price || 0) + Number(amountDiscounts || 0)
})

</script>

<template>
  
  <div
    class="shadow-lg md:rounded-md md:border md:border-neutral-100"
    data-testid="order-summary"
  >
    <div
      class="flex justify-between items-end py-2 px-4 md:px-6 md:pt-6 md:pb-4"
    >
      <p class="typography-headline-4 font-bold md:typography-headline-3">
        {{ $t("orderSummary") }}
      </p>
      <p class="typography-text-base font-medium" data-testid="total-in-cart">
        {{
          $t("itemsInCart", { count: totalItemsInCart })
        }}
      </p>
    </div>
    <div>
      <div class="px-4 pb-4 mt-3 md:px-6 md:pb-6 md:mt-0">
        <div class="flex flex-col justify-between typography-text-base mb-2 gap-2 border-t pt-4">
          <div class="flex flex-row grow pr-2">
            <p class="font-bold grow pr-2">{{ $t('itemsSubtotal') }}</p>
            <p class="flex text-right">{{ $currency(cart?.order?.amountSubtotal || 0) }}</p>
          </div>
          
          <div class="flex flex-row grow pr-2">
            <p class="font-bold grow pr-2">{{ $t("delivery") }}</p>
            <p v-if="cart?.order?.shippingMethod?.id" class="flex text-right">{{ $currency(cart?.order?.shippingMethod?.price || 0) }}</p>
            <p v-else class="flex text-right">--</p>
          </div>
          <div
            v-if="!cart?.order?.shippingMethod?.id" 
            class="flex flex-row grow pr-2"
          >
            <p class="grow text-left text-sm text-neutral-600">
              {{ $t('deliveryAtCheckout') }}
            </p>
          </div>
          
          <div v-if="cartHasDiscount" class="flex flex-row grow pr-2 pb-2 border-b border-neutral-200">
            <p class="font-bold grow pr-2">{{ $t("discounts", { count: cartHasDiscount }) }}</p>
          </div>

          <div
            v-if="cartHasDiscount"
            v-for="discount, index in mergedCoupons"
            :key="index"
            class="flex flex-col grow pr-2"
          >
            <CheckoutUiSummaryCodes
              :discount="discount"
            />
          </div>
          <div class="flex flex-row grow pr-2">
            <p class="font-bold grow pr-2">{{ $t("beforeTax")}}</p>
            <p class="flex text-right">{{ $currency( amountSubtotal ) }}</p>
          </div>

          <div class="flex flex-row grow pr-2">
            <p class="font-bold grow pr-2">{{ $t("estimatedTax") }}</p>
            <p class="flex text-right">{{ $currency(Number(cart?.order?.amountTax)) }}</p>
          </div> 

          <div
            v-if="cart.order?.giftCards"
            class="flex flex-row grow pr-2"
          >
            <p class="grow pr-2">{{ $t("giftCard", { count: cart.order.giftCards.length }) }}</p>
            <p class="flex text-right">{{ $currency(Number(cart.order?.amountGiftCards)) }}</p>
          </div>
          
          <div class="flex flex-row grow pr-2 justify-between typography-headline-4 md:typography-headline-3 font-bold pb-4 mb-4">
            <p class="grow pr-2">{{ $t("total") }}</p>
            <p class="flex text-right" data-textid="total"> {{ $currency(Number(cart?.order?.amountTotal)) }}</p>
          </div> 
          
        </div>
        
        <UiDivider class="my-4 w-auto" />
        <slot />
      </div>
    </div>
  </div>
</template>
