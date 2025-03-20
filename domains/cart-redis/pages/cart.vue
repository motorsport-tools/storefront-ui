<script lang="ts" setup>
import { SfButton, SfIconArrowBack, SfLoaderCircular } from '@storefront-ui/vue';
import Discount from '~/domains/core/components/ui/Discount.vue';

const NuxtLink = resolveComponent('NuxtLink');
const { cart, loadCart, cartIsEmpty, loading } = useCart();
const { isAuthenticated } = useAuth()
const localePath = useLocalePath();
const goToCheckout = () => (isAuthenticated.value ? localePath('/checkout') : localePath('/checkout/guest'));

if (!cart?.value?.order) {
  await loadCart(false);
}
</script>

<template>
  <NuxtLayout
    name="checkout"
    :back-to-cart="false"
    :back-label="$t('back')"
    :heading="$t('myCart')"
  >
  <div 
    v-if="!cartIsEmpty"
      class="lg:grid lg:grid-cols-12 md:gap-x-6"
      data-testid="cart-page-content"
  >

    <div class="col-span-7 mb-10 lg:mb-0">
      <div v-for="(orderLine, index) in cart.order?.orderLines" :key="orderLine?.id">
        <CartCollectedProductCard :order-line="orderLine" :class="{ 'border-t': index === 0 }" />
      </div>
      <Discount v-if="$viewport.isLessThan('lg')" class="mb-2" />
    </div>

    <div class="relative col-span-5 md:sticky md:top-10 h-fit" :class="{ 'pointer-events-none opacity-50': loading }">
      <SfLoaderCircular v-if="loading" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />
      <UiOrderSummary :cart="cart">
        <Discount v-if="$viewport.isGreaterOrEquals('lg')" class="mb-5" />
        <SfButton 
          size="lg"
          class="w-full mb-4 md:mb-0"
          :tag="NuxtLink"
          :to="goToCheckout()"
        >
          {{ $t('goToCheckout') }}
        </SfButton>
      </UiOrderSummary>
    </div>
  </div>
  <div v-else class="flex items-center justify-center flex-col pt-24 pb-32" data-testid="cart-page-content">
    <NuxtImg
      src="/images/empty-cart.svg"
      :alt="$t('emptyCartImgAlt')"
      width="192"
      height="192"
      loading="lazy"
    />
    <h2 class="mt-8">{{ $t('emptyCart') }}</h2>
  </div>
  </NuxtLayout>
</template>
