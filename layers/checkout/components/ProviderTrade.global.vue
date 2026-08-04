<template>
    <div>
        <div v-if="!loading" class="border-t pt-4 mt-4">
            <UiAlert 
                v-if="paymentInfo?.warning"
                size="sm"
                class="flex items-start bg-warning-200 ring-1 ring-warning-200 w-full mb-4"
            >
                <SfIconWarning class="text-sm mr-2 text-warning-700 shrink-0" />
                <span class="font-medium">{{ paymentInfo?.warning }}</span>
            </UiAlert>
            <div 
                v-if="paymentInfo?.availableCredit"
                class="flex flex-row grow pr-2"
            >
                <p class="grow pr-2"><strong>Available Credit:</strong></p>
                <p class="flex text-right">{{ $currency(paymentInfo.availableCredit) }}</p>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { 
    SfIconWarning,
} from '@storefront-ui/vue'
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

const {
    transaction,
    preparePayment,
    confirmCreditTransaction,
} = useTradeCreditPayment(
    props.method.providerId, 
    props.cart?.order?.id,   
    props.method?.code
)

const emit = defineEmits([
    'isPaymentReady',
    'providerPaymentHandler',
    'paymentLoading',
]);

const paymentInfo = ref<any>({})

const tradeCreditHandler = async () => {
    emit('paymentLoading', true)
    emit('isPaymentReady', false)

    const confirm = await confirmCreditTransaction(props.cart?.order?.id)

    window.location.href = confirm.redirectUrl

}

const initCheckout = async () => {
    emit('paymentLoading', true);
    loading.value = true

    paymentInfo.value = await preparePayment(props.cart?.order?.id)

    loading.value = false
    emit('paymentLoading', false);
    emit('isPaymentReady', paymentInfo?.value?.eligible);

    emit('providerPaymentHandler', tradeCreditHandler);

}

onMounted( async () => {
    initCheckout()
})

onBeforeUnmount(() => {
    paymentInfo.value = {}
})

</script>