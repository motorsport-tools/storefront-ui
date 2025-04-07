<script setup lang="ts">
import type { CustomCartData } from '~/graphql';
import { SfButton } from '@storefront-ui/vue';
const { loadCart } = useCart();
const { getPaymentConfirmation } = usePayment();

const orderData = ref<any>({})

onMounted(async () => {
  orderData.value = await getPaymentConfirmation();
  await loadCart(true);
});

</script>

<template>
    <div
      class="w-full min-h-[330px] flex flex-col gap-4 items-center justify-center"
    >
      <Icon
        name="i-material-symbols-check-circle"
        class="size-20 text-green-700"
      />
      <h1 class="text-3xl font-bold">{{ $t('thankYou.thankYou',{ orderNumber: orderData.order?.name}) }}</h1>
      <p>{{ $t('thankYou.text') }}</p>
      <SfButton @click="navigateTo('/')" size="lg" variant="secondary">
        {{ $t('continueShopping') }}
      </SfButton>
    </div>
</template>

<style scoped></style>
