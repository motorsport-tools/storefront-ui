<template>
    <div>
        <p>This payment will be credited on your account</p>
    </div>
</template>
<script lang="ts" setup>
import type { PaymentMethod } from '~/graphql'

const props = defineProps({
    method: {
      required: true,
      type: Object as PropType<PaymentMethod>,
    },
    cart: {
      required: true,
      type: Object,
    },
})

const loading = ref(false)

const emit = defineEmits([
    'isPaymentReady',
    'providerPaymentHandler',
    'paymentLoading',
]);

const TradePaymentHandler = async () => {
    console.log('Trade Payment Handler')

    

    return true
}

const initCheckout = async () => {
    emit('paymentLoading', true);
    loading.value = true
    console.log('Init Trade Checkout')

    loading.value = false
    emit('paymentLoading', false);
    emit('isPaymentReady', true);

    emit('providerPaymentHandler', TradePaymentHandler);

}

onMounted( async () => {
    initCheckout()
})

</script>