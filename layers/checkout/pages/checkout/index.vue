<script setup lang="ts">
import { SfLoaderCircular, SfIconLock } from "@storefront-ui/vue"
import { type PaymentMethod, type Partner, type ShippingMethod, AddressEnum } from "~/graphql"
import { useCountryList } from "~/layers/core/composable/useCountryList";

definePageMeta({
    layout: 'checkout',
})
const { cartIsEmpty, loading: cartLoading, loadCart } = useCart()
const { loading: deliveryLoading } = useDeliveryMethod()
const { loadUser, isAuthenticated } = useAuth()
const { loadCountries } = useCountryList()
const isLoading = computed(() => cartLoading.value || deliveryLoading.value);
const selectedProvider = ref(<PaymentMethod | null>(null))

await loadCountries()

const { $i18n } = useNuxtApp()
const { cart } = useCart()

const { steps, visibleSteps, isLastStep, currentStepId, currentStepIndex, allStepsCompleted, registerSteps, completeStep, goToStep, updateStepData, getAllData, getStepData, resetCheckout } = useCheckout()

import CustomerInfo from "./../../components/checkout/steps/CustomerInfo.vue"
import Address from "./../../components/checkout/steps/Address.vue"
import DeliveryMethod from "./../../components/checkout/steps/DeliveryMethod.vue"
import DeliveryRates from "./../../components/checkout/steps/DeliveryRates.vue"
import Payment from "./../../components/checkout/steps/Payment.vue"

const checkoutSteps = [
    {
        id: 'customer',
        component: CustomerInfo,
        title: `${$i18n.t('contactInfo.heading')}`,
        exData: (cart.value?.order?.partner as Partner),
        condition: () => true,
    },
    {
        id:'billing-address',
        component: Address,
        title: `${$i18n.t('billing.heading')}`,
        exData: (cart.value?.order?.partnerInvoice as Partner),
        addressType: AddressEnum.Billing,
        condition: () => true,
    },
    {
        id:'delivery-address',
        component: Address,
        title: `${$i18n.t('shipping.heading')}`,
        exData: (cart.value?.order?.partnerShipping as Partner),
        addressType: AddressEnum.Shipping,
        condition: () => {
            const billingData = getStepData('billing-address')
            if(billingData.value?.useDelivery || !billingData.value) {
                return false
            }
            return true
        }
    },
    {
        id: 'delivery-method',
        component: DeliveryMethod,
        title: `${$i18n.t('shippingMethod.heading')}`,
        subHeading: `${$i18n.t('shippingMethod.subHeading')}`,
        exData: (cart.value?.order?.shippingMethod as ShippingMethod),
        condition: () => {
            return !cart.value.order?.onlyServices
        }
    },
    {
        id: 'delivery-rates',
        component: DeliveryRates,
        title: `${$i18n.t('shippingMethod.rates.heading')}`,
        exData: (cart.value?.order?.shippingRate),
        condition: () => {
            const methodData = getStepData('delivery-method')
            if(methodData.value?.deliveryMethod === 10 || methodData.value?.deliveryMethod === 11) {
                return true
            }
            return false
        }
    },
    {
        id:'payment',
        component: Payment,
        title: `${$i18n.t('checkoutPayment.heading')}`,
        condition: () => true
    }
]

onMounted(async () => {
    if(isAuthenticated.value) {
        await Promise.all([loadUser(true), loadCart()]);
    } else {
        await Promise.all([loadCart()])
    }
    registerSteps(checkoutSteps)
})
</script>
<template>
    <main 
        class="w-full narrow-container mb-20"
        data-testid="checkout-layout"
    >
        <CheckoutHeader
            :title="$t('secureCheckout')"
            :backText="$t('backToCart')"
            :icon="SfIconLock"
        />
        <div v-if="!cartIsEmpty">
            <div class="lg:grid lg:grid-cols-12 md:gap-x-6">
                <div class="col-span-7 mb-10 md:mb-0">
                    <CheckoutContainer
                        :visibleSteps="visibleSteps"
                        :currentStepId="currentStepId"
                        :currentStepIndex="currentStepIndex"
                        :completeStep="completeStep"
                        :goToStep="goToStep"
                        :updateStepData="updateStepData"
                        :steps="steps"
                    />
                </div>
                <div class="col-span-5 md:sticky md:top-20 h-fit">
                    <SfLoaderCircular v-if="isLoading" class="absolute top-[130px] right-0 left-0 m-auto z-[999] opacity-100!" size="2xl" />
                    <div :class="{ 'pointer-events-none opacity-50': isLoading }">
                        <CheckoutSummary
                            :getStepData="getStepData"
                            :allStepsCompleted="allStepsCompleted"
                            :isLastStep="isLastStep"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center py-10">
            <SfLoaderCircular size="xl" class="mt-[160px] mb-[10px]" />
            <p>Loading checkout details...</p>
        </div>
    </main>
</template>