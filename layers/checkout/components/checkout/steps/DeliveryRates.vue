<script setup lang="ts">
import type { Cart, ShippingMethod } from '~/graphql';
import { SfLoaderCircular, SfRadio, SfIconBlock } from "@storefront-ui/vue"
import RateTable from '../RateTable.vue';

const props = defineProps<{
    stepData?: Record<string, any>
    showSummary?: Boolean
    exData?: ShippingMethod
    active: Boolean
    steps: Array<any>
}>()

watch(
  () => props.active,
  async (active) => {
    if (active) {
      await loadRates({ carrierId: cart.value?.order?.shippingMethod?.id, orderId: cart.value?.order?.id})
    }
  },
  { immediate: false }
)

const emit = defineEmits<{
    complete: [data: Record<string, any>]
    update: [data: Record<string, any>]
}>()

const { loadRates, setRate, ratesLoading, rates } = useDeliveryMethod()
const { cart } = useCart();
const form = reactive({
    deliveryRate: props.exData?.id || null
})

onMounted(async () => {
    if (props.stepData) {
        Object.assign(form, props.stepData)
    }
    if(props.steps?.find(s => s.id == 'delivery-rates').completed) {
        await loadRates({ carrierId: cart.value?.order?.shippingMethod?.id, orderId: cart.value?.order?.id})
    }
})

const handleSubmit = async () => {
    if(form.deliveryRate) {
        await setRate({serviceId: form.deliveryRate})
        emit('complete', { ...form })
    }
}
</script>
<template>
    <div
        data-testid="checkout-rates"
        class="md:px-4 py-6"
    >
        <h2 class="text-neutral-900 text-lg font-bold mb-4">
            {{ $t("shippingMethod.rates.heading") }}
        </h2>
        <div name="summary" v-show="showSummary">
            <RateTable
                :rates="rates"
                v-model="form.deliveryRate"
                :summary="true"
            />
        </div>
        <div v-show="!showSummary">
            <form 
                data-testid="delivery-method-form"
                @submit.prevent="handleSubmit"
                class="space-y-4"
            >
                <div 
                    v-if="ratesLoading"
                    class="w-full text-center"
                >
                    <SfLoaderCircular size="base" />
                    <p class="mb-2">Please wait... gathering shipment information</p>
                </div>

                <div 
                    v-else-if="!ratesLoading && rates.length > 0"
                >
                    <RateTable
                        :rates="rates"
                        v-model="form.deliveryRate"
                        :summary="false"
                    />
                </div>
                <div 
                    v-else-if="!ratesLoading && rates.length === 0" 
                    class="flex mb-6"
                >
                    <SfIconBlock class="mr-2 text-neutral-500" />
                    <p>{{ $t("shippingMethod.rates.none") }}</p>
                </div>
                <button
                    type="submit"
                    class="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                    Continue
                </button>
            </form>
        </div>
    </div>
</template>