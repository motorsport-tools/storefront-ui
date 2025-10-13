<template>
    <div id="payment-method-messaging-element" ref="dropinDivElement"></div>
</template>
<script setup lang="ts">
import type { StripeDropinType } from '~/graphql'

interface Props {
    specialPrice: number,
    regularPrice: number,
}
const props = defineProps<Props>()

// Use i18n to get locale currency code
const { locale, getNumberFormat, locales } = useI18n()
const format = getNumberFormat(locale.value);
const currency = format.currency.currency;

const countryCode = locales.value.find(l => l.code === locale.value)?.countryCode;

const { cart } = useCart()

const stripeRef = ref<any>(null)
const stripeElement = ref<any>([])
const stripeDropin = ref<StripeDropinType | null>(null)
const dropinDivElement = ref(null)
const stripeLoading = ref<boolean>(false)
const {
    acquirerInfo,
    getStripeAcquirerInfo,
} = useStripeDirectPayment(
    14, 
    cart.value?.order?.id,  
    'card'
)

onMounted( async () => {
    if (!window.Stripe) {
        console.error('Failed to initialize Stripe')
        return
    }
    stripeLoading.value = true
    await getStripeAcquirerInfo()
    
    if(!stripeRef.value) {
        stripeRef.value = Stripe(acquirerInfo.value?.publishable_key, {})
    }

    let elementsOptions =  {
        appearance: { 
            theme: 'stripe',
            disableAnimations: true,
            variables: {
                fontFamily: ' "Figtree", sans-serif',
            },
            rules: {
                '.PaymentMethodMessaging': {
                    textAlign: 'left'
                }
            },
        },
    }

    stripeElement.value = stripeRef.value.elements(elementsOptions)

    let price = props.specialPrice? props.specialPrice : props.regularPrice

    const messageElementOptions = {
        currency: currency,
        amount: Math.round(price * 100),
        countryCode: countryCode
    }

    stripeDropin.value = stripeElement.value.create(
        'paymentMethodMessaging', messageElementOptions
    )

    stripeDropin.value?.mount('#payment-method-messaging-element')

    stripeLoading.value = false
})
</script>