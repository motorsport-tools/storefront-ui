<script setup lang="ts">
import { useCountryList } from "~/layers/core/composable/useCountryList";
import { AddressEnum, type Partner } from "~/graphql";
import { SfLoaderCircular } from "@storefront-ui/vue";

const { cart, totalItemsInCart, cartIsEmpty, loading: cartLoading, loadCart } = useCart()
const { loadCountries } = useCountryList()
const { loadUser } = useAuth()
const { loading: deliveryLoading } = useDeliveryMethod()
const router = useRouter()

const selectedProvider = ref<PaymentMethod | null>(null);

onMounted(async () => {
  await Promise.all([loadUser(true), loadCart(), loadCountries()]);

  if (totalItemsInCart?.value === 0) {
    await navigateTo("/cart")
  }
})

const isLoading = computed(() => cartLoading.value || deliveryLoading.value);

function handleSelectedProviderUpdate(newProvider: Number) {
  selectedProvider.value = newProvider;
}

</script>
<template>
  <NuxtLayout
    name="checkout"
    :back-to-cart="false"
    :back-label="$t('backToCart')"
    :heading="$t('checkout')"
  >
    <div v-if="!cartIsEmpty">
      <div class="lg:grid lg:grid-cols-12 md:gap-x-6">
        <div class="col-span-7 mb-10 md:mb-0">
          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />

          <LazyCheckoutContactInformation
            v-if="cart?.order?.partner"
            :heading="$t('contactInfo.heading')"
            :partner-data="cart?.order?.partner as Partner"
          />

          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <LazyCheckoutAddressForm
            :heading="$t('shipping.heading')"
            :description="$t('shipping.description')"
            :button-text="$t('shipping.addButton')"
            :type="AddressEnum.Shipping"
            :saved-address="cart.order?.partnerShipping as Partner"
          />
          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <LazyCheckoutAddressForm
            :heading="$t('billing.heading')"
            :description="$t('billing.description')"
            :button-text="$t('billing.addButton')"
            :type="AddressEnum.Billing"
            :saved-address="cart.order?.partnerInvoice as Partner"
          />

          <UiDivider class-name="w-screen md:w-auto -mx-4 md:mx-0" />

          <LazyCheckoutShippingMethod/>

          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />

          <LazyCheckoutPayment 
            v-if="cart?.order?.shippingMethod?.id"
            :selected-provider="selectedProvider"
            @update:active-payment="handleSelectedProviderUpdate"
          />

          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0 mb-10" />
        </div>
        <div class="col-span-5 md:sticky md:top-20 h-fit">
          <SfLoaderCircular v-if="isLoading" class="absolute top-[130px] right-0 left-0 m-auto z-[999] opacity-100!" size="2xl" />
          <div :class="{ 'pointer-events-none opacity-50': isLoading }">
            <CheckoutSummary 
              :selected-method="selectedProvider"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Loading State -->
    <div v-else class="text-center py-10">
      <SfLoaderCircular size="xl" class="mt-[160px] mb-[10px]" />
      <p>Loading checkout details...</p>
    </div>
  </NuxtLayout>
</template>
