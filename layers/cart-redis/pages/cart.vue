<script lang="ts" setup>
import { SfButton, SfLoaderCircular } from '@storefront-ui/vue';
import {
ReviveEnum,
} from "~/graphql"

const NuxtLink = resolveComponent('NuxtLink');
const { cart, cartIsEmpty, loading, frequentlyTogetherProducts, reviveCart } = useCart();
const { isAuthenticated } = useAuth()
const { loading: deliveryLoading } = useDeliveryMethod()
const localePath = useLocalePath();
const goToCheckout = () => (isAuthenticated.value ? localePath('/checkout') : localePath('/guest/login'));

const route = useRoute()

const isLoading = computed(() => loading.value || deliveryLoading.value);

const accessToken = computed(() => route.query.access_token as string)

const doReviveCart = async (action: string) => {
  const revive = action.toString().toUpperCase()
  if (!revive || !accessToken.value) return
  if (!Object.values(ReviveEnum).includes(revive as ReviveEnum)) return
  await reviveCart(accessToken.value, revive)
  navigateTo(localePath('/cart'))
}

</script>

<template>
  <main 
    class="w-full narrow-container mb-20"
    data-testid="checkout-layout"
  >
    <CheckoutHeader
      :title="$t('cart')"
      :backText="$t('back')"
      :backToCart="false"
    />
    <ClientOnly>
    <div
      v-if="accessToken && !loading"
    >
      Token: {{accessToken}} <br/>
      <div class="bg-blue-100 text-blue-800 rounded-lg shadow-sm p-6 w-full my-4 max-w-2xl mx-auto">
        <h2 class="font-medium text-xl">This is your current cart</h2>
        <p class="my-2">You have followed a link to restore a previous cart.</p>
        <p class="my-2"><a class="text-red-800 font-bold hover:underline cursor-pointer" title="Replace exisiting cart with previous cart" @click.prevent="doReviveCart('squash')">Click Here</a> to restore the previous cart. Your current cart will be replaced with the previous cart.</p>
        <p v-if="!cartIsEmpty" class="my-2"><a class="text-red-800 font-bold hover:underline cursor-pointer" title="Merge previous cart with existing cart" @click.prevent="doReviveCart('merge')">Click Here</a> if you want to merge your previous cart with your current cart.</p>
      </div>  
    </div>
    </ClientOnly>
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
        <ClientOnly>
          <div v-for="(orderLine, index) in cart.order?.orderLines?.filter(line => line.isRewardLine === false && line.isDelivery === false)" :key="orderLine?.id">
            <CartCollectedProductCard :order-line="orderLine" :class="{ 'border-t': index === 0 }" />
          </div>
        </ClientOnly>
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
            <UiPaymentIcons
              class="my-4"
            />
            <p class="text-center text-sm">{{ $t('cartDetailsProtected') }} <NuxtLink class="text-blue-600 hover:underline hover:text-blue-700" href="/privacy">{{ $t('learnMore') }}</NuxtLink></p>
          </UiOrderSummary>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center flex-col pt-24 pb-32" data-testid="cart-page-content">
      <NuxtImg
        src="/img/basket-empty.png"
        :alt="$t('emptyCartImgAlt')"
        width="300"
        height="300"
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
  </main>
</template>
