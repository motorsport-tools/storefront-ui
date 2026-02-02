<script setup lang="ts">
import {
  SfIconRemoveShoppingCart,
  SfIconSell,
  SfLink,
  SfLoaderCircular,
} from "@storefront-ui/vue";
import type { CustomOrderLineWithStockFromRedis, OrderLine, Product } from '~/graphql'
const NuxtLink = resolveComponent("NuxtLink");

const props = defineProps({
  orderLine: {
    type: Object as PropType<CustomOrderLineWithStockFromRedis>,
    required: true,
  },
});

const { updateItemQuantity, removeItemFromCart } = useCart()
const { resetCheckoutFromStep } = useCheckout()
const itemLoading = ref<Boolean>(false)
const localQty = ref(props.orderLine.quantity ?? 1)

// Sync local state when prop updates (e.g. from server)
watch(() => props.orderLine.quantity, (newVal) => {
  if (newVal !== undefined && newVal !== null && newVal !== localQty.value) {
    localQty.value = newVal
  }
})

const updateQty = async (id:number, qty:number) => {
  // Strict guard against invalid values
  if (qty === null || qty === undefined || isNaN(qty)) return

  // Optimistic update - don't block UI with itemLoading immediately if debating
  // But since backend is source of truth, we should probably reflect loading state for the specific item
  
  itemLoading.value = true
  try {
    await updateItemQuantity(id, qty)
  } catch (e) {
    // Revert on failure
    localQty.value = props.orderLine.quantity ?? 1
  } finally {
    itemLoading.value = false
  }
}

const handleQtyUpdate = (newQty: number) => {
  if (newQty === null || newQty === undefined || isNaN(newQty)) return;
  localQty.value = newQty;
  resetCheckoutFromStep('customer');
  updateQty(props.orderLine.id, newQty);
}
</script>

<template>
  <div
    class="relative flex first:border-t border-b-[1px] border-neutral-200 hover:shadow-lg min-w-[320px] p-4 last:mb-0"
    data-testid="cart-product-card"
  >
    <div 
      v-if="itemLoading"
      class="absolute top-0 left-0 w-full h-full inset-0 bg-[#222222] backdrop-blur-xl bg-opacity-10 flex flex-col items-center justify-center z-10"
    >
      <SfLoaderCircular
        class="ml-2 text-primary-700"
        size="sm"
      />
    </div>
    <div class="relative overflow-hidden w-[100px] sm:w-[176px]">
      <SfLink
        :to="mountUrlSlugForProductVariant(orderLine.product as Product)"
        :title="orderLine?.product?.name || orderLine?.name"
        :tag="NuxtLink"
        class="product__img"
      >
        <NuxtImg
          class="w-full h-auto"
          :src="
            $getImage(
              String(orderLine.product?.image),
              370,
              370,
              String(orderLine.product?.imageFilename)
            )
          "
          :alt="orderLine.product?.imageFilename ?? ''"
          width="300"
          height="300"
          loading="lazy"
          format="webp"
        />
      </SfLink>
      <UiProductCardRibbon
        :isOnSale="orderLine?.product?.combinationInfo?.has_discounted_price || false"
        size="xs"
        class="absolute top-0 left-0 p-2"
      />
    </div>
    <div class="flex flex-col pl-4 min-w-[180px] flex-1">
      <div class="flex justify-between">
        <SfLink
          :tag="NuxtLink"
          :to="mountUrlSlugForProductVariant(orderLine.product as Product)"
          variant="secondary"
          class="no-underline typography-text-sm sm:typography-text-lg cursor-pointer"
        >
          {{ orderLine?.product?.name || orderLine?.name }}
        </SfLink>
        <SfIconRemoveShoppingCart
          class="cursor-pointer"
          @click="resetCheckoutFromStep('customer'); removeItemFromCart(orderLine.id)"
        />
      </div>
      <div class="my-2 sm:mb-0">
        <ul
          class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700"
        >
          <li
            v-for="attribute in orderLine.product?.variantAttributeValues"
            :key="attribute.id"
          >
            <span class="mr-1">{{ attribute.attribute?.name }}:</span>
            <span class="font-medium">{{ attribute.name }}</span>
          </li>
        </ul>
      </div>
      <div
        class="items-start sm:items-center sm:mt-auto flex flex-col sm:flex-row"
      >
        <span
          v-if="orderLine.priceSubtotal"
          class="text-black sm:order-2 font-bold typography-text-sm sm:typography-text-lg sm:ml-auto"
        >
          {{ $currency(orderLine.priceSubtotal) }}
          <span
            class="text-neutral-500 ml-2 line-through typography-text-xs sm:typography-text-sm font-normal"
            v-if="orderLine.product?.combinationInfoVariant?.has_discounted_price"
          >
            {{
              $currency(orderLine.product?.combinationInfoVariant?.price * (localQty ?? 1))
            }}
          </span>
        </span>
        <span
          v-else
          class="font-bold sm:ml-auto sm:order-1 typography-text-sm sm:typography-text-lg"
        >
          {{ $currency(orderLine.priceTotal) }}
        </span>
        <UiQuantitySelector
          :model-value="localQty"
          :min-value="1"
          :max-value="Number(orderLine.product?.stock || 100)"
          :maxQty="Number(orderLine.product?.stock || 100)"
          class="mt-4 sm:mt-0"
          @update:model-value="handleQtyUpdate"
        />
      </div>
    </div>
  </div>
</template>
