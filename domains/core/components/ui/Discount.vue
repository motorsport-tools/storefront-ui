<script setup lang="ts">
import { SfAccordionItem, SfIconChevronLeft, SfIconClose, SfButton, SfInput, SfLoaderCircular, useDisclosure } from '@storefront-ui/vue';
const { applyDiscount, loading } = useDiscount();
const { loadCart } = useCart()

const { isOpen: isCouponOpen, toggle: toggleCoupon } = useDisclosure()
const promo = ref<string>('')

const handleApplyPromo = async () => {
  await Promise.all([
    applyDiscount(promo.value),
    loadCart(),
  ])
};

</script>

<template>
  <div class="border-b border-neutral-200">
    <SfAccordionItem
      v-model="isCouponOpen"
    >
      <template #summary>
        <div :class="['flex justify-between font-medium p-3 my-4', { 'bg-gray-100 rounded-md': isCouponOpen }]">
          <p class="pl-3">{{ $t('coupon.title') }}</p>
          <SfIconChevronLeft
            :class="['text-neutral-500', { 'rotate-90': isCouponOpen, '-rotate-90': !isCouponOpen }]"
          />
        </div>
      </template>
      <div class="flex mb-4">
        <div class="flex-grow mr-2" data-testid="couponCode">
          <SfInput
            v-model="promo"
            size="lg"
            :placeholder="$t('coupon.enterCode')"
            :aria-label="$t('coupon.name')"
            type="text"
            required
          />
        </div>
        <SfButton
          @click="handleApplyPromo"
          :disabled="!promo || loading"
          size="lg"
          variant="secondary"
        >
          {{ $t('coupon.apply') }}
        </SfButton>
      </div>
    </SfAccordionItem>

  </div>
</template>