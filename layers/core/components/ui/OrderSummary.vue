<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';
const { cart, totalItemsInCart, cartHasDiscount  } = useCart();
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
            v-for="discount in cart.order?.orderLines?.filter(l => l.isRewardLine)"
            :key="discount.id"
            class="flex flex-col grow pr-2"
          >
            <div class="flex justify-between mb-2">
              <div class="flex grow pr-2">
                <p class="text-sm text-gray-500 ml-2">
                  {{ discount.coupon?.name }}
                </p>
                <p v-if="discount.coupon?.programType && discount.coupon?.programType != 'promotion'" class="flex grow text-sm text-gray-500 ml-2">
                  {{ discount.coupon?.code }}
                </p>
              </div>
              <p class="flex text-right text-sm text-gray-500">
                {{  $currency(Number(discount.priceSubtotal)) }}
              </p>
            </div>
          </div>

          <div class="flex flex-row grow pr-2">
            <p class="font-bold grow pr-2">{{ $t("beforeTax")}}</p>
            <p class="flex text-right">{{ $currency( Number(cart?.order?.amountSubtotal || 0) + Number(cart?.order?.shippingMethod?.price || 0) + Number(cart?.order?.amountDiscounts || 0) ) }}</p>
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
