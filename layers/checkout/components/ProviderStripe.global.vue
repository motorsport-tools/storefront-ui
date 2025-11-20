<template>
    <div>
        <div id="dropin-container" ref="dropinDivElement" class="mt-4">
        </div>
    </div>
</template>
<script lang="ts" setup>
import type { PaymentMethod, StripeDropinType } from '~/graphql'

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

console.log('Selected Method: ', props.method)

const stripeRef = ref<any>(null)
const stripeDropin = ref<StripeDropinType | null>(null)
const dropinDivElement = ref(null)
const loading = ref(false)
const stripeElement = ref<any>([])


const {
    acquirerInfo,
    transaction,
    getStripeAcquirerInfo,
    getStripeInlineFormValues,
    openStripeTransaction,
} = useStripeDirectPayment(
    props.method.providerId, 
    props.cart?.order?.id,   
    props.method?.code
)

const emit = defineEmits([
    'isPaymentReady',
    'providerPaymentHandler',
    'paymentLoading',
]);

const initStripeCheckout = async () => {
    emit('paymentLoading', true);
    if (!window.Stripe) {
        console.error('Failed to initialize Stripe')
        return
    }
    loading.value = true
    await getStripeAcquirerInfo()
    
    if(!stripeRef.value) {
        stripeRef.value = Stripe(acquirerInfo.value?.publishable_key, {
            //'apiVersion': '2019-05-16',
        })
    }
    
    const inlineFormValues = await getStripeInlineFormValues()
    await openStripeTransaction(inlineFormValues['is_tokenization_required'], false);

    //Prepare Element
    let elementsOptions =  {
        appearance: { 
            theme: 'stripe',
            variables: {
                fontFamily: ' "Figtree", sans-serif',
            },
        },
        currency: inlineFormValues['currency_name'],
        captureMethod: inlineFormValues['capture_method'],
        paymentMethodTypes: [
        inlineFormValues['payment_methods_mapping'][props.method.code]
            ?? props.method.code
        ],
        mode: 'payment',
        amount: parseInt(inlineFormValues['minor_amount'])
    }
    if(inlineFormValues['is_tokenization_required']) {
        elementsOptions['setupFutureUsage'] = 'off_session'
    }

    stripeElement.value = stripeRef.value.elements(elementsOptions)

    const paymentElementOptions = {
        defaultValues: {
            billingDetails: inlineFormValues['billing_details'],
        },
        paymentMethods: {
            link: 'never',
        }
    }

    stripeDropin.value = stripeElement.value.create(
        'payment', paymentElementOptions
    )

    stripeDropin.value.on('loaderror', response => {
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
        console.log('Event:', event)
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

    stripeDropin.value?.mount('#dropin-container')

    loading.value = false
    emit('providerPaymentHandler', stripeDropin.value?.submit);
}

onMounted( async () => {
    const { proxy, onLoaded } = useScript('https://js.stripe.com/v3/')
    onLoaded(() => {
        initStripeCheckout()
    })
})

onBeforeUnmount(() => {
  stripeDropin.value?.unmount()
  stripeDropin.value = null
  stripeElement.value = null
})
</script>