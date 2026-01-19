<script setup lang="ts">
import type { StripeDropinType } from '~/graphql'
import payment from '../middleware/payment';
const props = defineProps<{
  orderData: any;
}>();

const emit = defineEmits([
    'isPaymentReady',
    'providerPaymentHandler',
    'paymentLoading',
]);

const stripeRef = ref<any>(null)
const stripeDropin = ref<StripeDropinType | null>(null)
const stripeElement = ref<any>([])
const loading = ref(false)

const { loadPaymentMethods, paymentProviders, loading: paymentLoading } = usePayment();
const {
    acquirerInfo,
    transaction,
    getStripeAcquirerInfo,
    getStripeInlineFormValues,
    openStripeTransaction,
} = useStripeDirectPayment(
    props.orderData?.transaction?.providerId || 14, 
    props.orderData.saleOrder.id,   
    'card'
)

const initStripeCheckout = async () => {
    emit('paymentLoading', true);
    if (!window.Stripe) {
        console.error('Failed to initialize Stripe')
        return
    }
    loading.value = true
    await loadPaymentMethods( props.orderData?.saleOrder?.id )
    console.log('-- Payment Providers:', paymentProviders.value);

    await getStripeAcquirerInfo()

    console.log('-- Acquirer Info:', acquirerInfo.value);

    const inlineFormValues = await getStripeInlineFormValues(props.orderData.saleOrder.id || null)

    console.log('-- Inline Form Values:', inlineFormValues);

    const paymentMethodTypes = paymentProviders.value?.flatMap(provider => provider.paymentMethods?.map(pm => inlineFormValues['payment_methods_mapping'][pm.code] ?? pm.code)) || ['card'];

    if(!stripeRef.value) {
        stripeRef.value = Stripe(acquirerInfo.value?.publishable_key, {
        })
    }

    //Prepare Element
    let elementsOptions =  {
        appearance: { 
            theme: 'stripe',
            variables: {
                fontFamily: ' "Figtree", sans-serif',
            },
        },
        
        paymentMethodTypes: paymentMethodTypes,
        
        currency: inlineFormValues['currency_name'],
        captureMethod: inlineFormValues['capture_method'],
        mode: 'payment',
        amount: parseInt(inlineFormValues['minor_amount'])
    }
    if(inlineFormValues['is_tokenization_required']) {
        elementsOptions['setupFutureUsage'] = 'off_session'
    }

    stripeElement.value = stripeRef.value.elements(elementsOptions)

    const paymentElementOptions = {
        layout: {
            type: 'accordion',
            defaultCollapsed: false,
            radios: false,
            spacedAccordionItems: true,
        },
        paymentMethods: {
            link: 'never',
        },
        wallets: {
            googlePay: 'auto',
            applePay: 'auto',
        }
    }

    stripeDropin.value = stripeElement.value.create(
        'payment', paymentElementOptions
    )

    stripeDropin.value?.on('loaderror', response => {
        loading.value = false
        console.error('Failed to display the payment form', response.error.message)
        emit('isPaymentReady', false);
        emit('paymentLoading', false);
    })

    stripeDropin.value?.on('ready', event => {
        loading.value =false
        emit('paymentLoading', false);
    })

    stripeDropin.value?.on('change', event => {
        emit('paymentLoading', true);
        if(event.complete) {
            emit('isPaymentReady', true);
        } else {
            emit('isPaymentReady', false);
        }
        emit('paymentLoading', false);
    })

    stripeDropin.value.submit = async (event: Event) => {
        emit('isPaymentReady', false);
        emit('paymentLoading', true);
        try {
            //Stripe Validating it's own form.
            await stripeElement.value.submit()
        } catch (error) {
            emit('isPaymentReady', true);
            emit('paymentLoading', false);
            //TODO: Output stripe validation error somewhere..
            console.error('Payment Error: ', error)
        }

        try {
            await openStripeTransaction(inlineFormValues['is_tokenization_required'], false, props.orderData.saleOrder.id || null);

            const confirmOptions = {
                elements: stripeElement.value,
                clientSecret: transaction.value?.client_secret,
                confirmParams: {
                    return_url: transaction.value?.return_url
                }
            }

            return await stripeRef.value.confirmPayment(confirmOptions)

        } catch (error) {
            emit('isPaymentReady', true);
            emit('paymentLoading', false);
            console.error('Payment Error: ', error)
        }
    }

    stripeDropin.value?.mount('#stripe-payment')

    loading.value = false
    emit('providerPaymentHandler', stripeDropin.value?.submit);

}

onMounted( async () => {
    const { proxy, onLoaded } = useScript('https://js.stripe.com/v3/')
    onLoaded(async () => {
        initStripeCheckout()
    })
})

</script>
<template>
    <div id="stripe-payment" ref="stripeCheckout" class="mb-6"></div>
</template>