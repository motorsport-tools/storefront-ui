<template>
  <div v-if="showPaymentModal">
    <div v-if="allPaymentMethods.length > 0">
      <PaymentMethod 
        :active-method="selectedMethod || allPaymentMethods[0]"
        :payment-methods="allPaymentMethods"
        @update:active-payment="selectPaymentMethod"
      />
    <!--
    <ProviderListOptions
      :active-provider="selectedProvider || paymentProviders[0]"
      :payment-providers="paymentProviders"
      @update:active-payment="updateSelectedProvider"
    />
    -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaymentMethod } from "~/graphql";

const emit = defineEmits<{
  (e: 'update:active-payment', method: PaymentMethod): void;
}>();

const {
  loadPaymentMethods,
  paymentProviders,
  loading: paymentLoading,
} = usePayment();

//const selectedProvider = ref<PaymentProvider | null>(null);
const selectedMethod = ref<PaymentMethod | null>(null);
const showPaymentModal = ref(false);

await loadPaymentMethods();

const allPaymentMethods = computed(() => {
  return paymentProviders.value
    .flatMap(provider => 
      provider.paymentMethods && Array.isArray(provider.paymentMethods)
        ? provider.paymentMethods
            .filter(method => method !== null) 
            .map(method => ({
              ...method,
              providerId: provider.id,  
              providerCode: provider.code,  
            }))
        : []  
    )
    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0)); 
});

if (allPaymentMethods.value.length > 0) {
  showPaymentModal.value = true;
  //selectedMethod.value = allPaymentMethods.value[0];
}

// Handle selecting a payment method
function selectPaymentMethod(method: PaymentMethod) {
  selectedMethod.value = method;
  emit('update:active-payment', method);  
}
</script>
