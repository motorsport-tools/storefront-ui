<script setup lang="ts">
import { SfButton, SfLink, SfLoaderCircular } from "@storefront-ui/vue";
import type { PaymentMethod } from "~/graphql";

const props = defineProps<{
  getStepData: (stepId: string) => Record<string, any>;
  allStepsCompleted: boolean;
}>();

const { cart } = useCart();
const { makeGiftCardPayment, loading: discountLoading } = useDiscount();

const isPaymentWithCardReady = ref(false);
const providerPaymentHandler = ref();
const selectedMethod = ref<PaymentMethod | null>(null);
const loading = ref(false);

const giftCards = ref(cart.value?.order?.giftCards);

const hasFullPaymentWithGiftCard = computed(() =>
  giftCards.value?.length > 0 && cart.value?.order?.amountTotal === 0,
)

const handleGiftCardPayment = async () => {
  await makeGiftCardPayment();
}

//const paymentData = getStepData('payment')
const paymentData = props.getStepData('payment')

const readyToPay = computed(() => {
  selectedMethod.value = paymentData.value?.paymentMethod || null

  if(paymentData.value?.paymentMethod?.id && isPaymentWithCardReady.value && !loading.value && props.allStepsCompleted) return true

  return false
  
})
</script>

<template>
  <UiOrderSummary>
    <SfButton
      v-if="hasFullPaymentWithGiftCard"
      size="lg"
      class="w-full mb-4 md:mb-0"
      :disabled="discountLoading"
      @click.prevent="handleGiftCardPayment"
    >
      {{ $t("placeOrder") }}
    </SfButton>

    <SfButton
      v-else
      size="lg"
      class="w-full mb-4 md:mb-0"
      :disabled="!readyToPay || loading"
      @click="providerPaymentHandler"
    >
      <span v-if="loading">
        <SfLoaderCircular
          v-if="loading"
          class="ml-2 text-white"
          size="sm"
        />
      </span>
      <span v-else>
      {{ $t("placeOrder") }}
      </span>
    </SfButton>

    <p class="text-sm text-center mt-4 pb-4 md:pb-0">
      <i18n-t keypath="termsInfo" scope="global">
        <template #terms>
          <SfLink
            href="#"
            class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
          >
            {{ $t("termsAndConditions") }}
          </SfLink>
        </template>
        <template #privacyPolicy>
          <SfLink
            href="#"
            class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
          >
            {{ $t("privacyPolicy") }}
          </SfLink>
        </template>
      </i18n-t>
    </p>

    <component
      v-if="
        !!selectedMethod?.providerCode &&
        !hasFullPaymentWithGiftCard
      "
      :is="getPaymentProviderComponentName(selectedMethod?.providerCode)"
      :key="selectedMethod?.id"
      :method="selectedMethod"
      :cart="cart"
      @is-payment-ready="($event: any) => (isPaymentWithCardReady = $event)"
      @provider-payment-handler="
        ($event: any) => (providerPaymentHandler = $event)
      "
      @payment-loading="($event: any) => (loading = $event)"
    />
  </UiOrderSummary>
</template>
