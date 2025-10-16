<script lang="ts" setup>
import { SfButton, SfIconArrowBack, SfLoaderCircular } from '@storefront-ui/vue';

const NuxtLink = resolveComponent('NuxtLink');
const { cart, loadCart, cartIsEmpty, loading, frequentlyTogetherProducts } = useCart();
const { isAuthenticated } = useAuth()
const { loading: deliveryLoading } = useDeliveryMethod()
const localePath = useLocalePath();
const goToCheckout = () => (isAuthenticated.value ? localePath('/checkout') : localePath('/guest/login'));

const isLoading = computed(() => loading.value || deliveryLoading.value);

await loadCart()
</script>

<template>
  <NuxtLayout
    name="checkout"
    :back-to-cart="false"
    :back-label="$t('back')"
    :heading="$t('myCart')"
  >
  <div
    v-if="loading"
    class="w-full flex flex-col items-center justify-center min-h-[60vh]"
  >
    <SfLoaderCircular
      size="xl"
      class="my-32"
    />
  </div>
  <div 
    v-else-if="!cartIsEmpty"
      class="lg:grid lg:grid-cols-12 md:gap-x-6"
      data-testid="cart-page-content"
  >

    <div class="col-span-7 mb-10 lg:mb-0">
      <div v-for="(orderLine, index) in cart.order?.orderLines?.filter(line => line.isRewardLine === false && line.isDelivery === false)" :key="orderLine?.id">
        <CartCollectedProductCard :order-line="orderLine" :class="{ 'border-t': index === 0 }" />
      </div>
      <Discount v-if="$viewport.isLessThan('lg')" class="mb-2" />
    </div>

    <div class="relative col-span-5 md:sticky md:top-10 h-fit">
      <SfLoaderCircular v-if="isLoading" class="absolute top-[130px] right-0 left-0 m-auto z-[999] opacity-100!" size="2xl" />
      <div :class="{ 'pointer-events-none opacity-50': isLoading }">
        <UiOrderSummary :cart="cart">
          <UiDiscount v-if="$viewport.isGreaterOrEquals('lg')" class="mb-5" />
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
  <section    
    v-if="frequentlyTogetherProducts?.length > 0"
    class="lg:mx-4 mt-36"
  >
    <LazyProductSlider
    heading="Frequently bought together"
    text="You may also like"
    :product-template-list="frequentlyTogetherProducts"
    />
  </section>
  <section
    class="lg:mx-4 mt-6"
  >
    <LazyProductRecentViewSlider
      text="Your recent views"
    />
  </section>
  </NuxtLayout>
</template>
