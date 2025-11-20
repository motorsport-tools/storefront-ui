<script setup lang="ts">
const props = defineProps<{
    stepData?: Record<string, any>
}>()

const emit = defineEmits<{
    complete: [data: Record<string, any>]
    update: [data: Record<string, any>]
}>()

const form = reactive({
    paymentMethodId: null as number | null,
    paymentMethod: null as any | null 
})

const { loadPaymentMethods, paymentProviders, loading: paymentLoading } = usePayment();

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

onMounted(async () => {
    if (props.stepData) {
        Object.assign(form, props.stepData)
    }
    await loadPaymentMethods()
})

const handleSubmit = async (e:number) => {

    form.paymentMethodId = e

    const selectedMethod = allPaymentMethods.value.find(m => m.id === e)
    
    if (!selectedMethod) return

    form.paymentMethod = toRaw(selectedMethod)
    
    //Adding this breaks it nothing changes, and it the above fires like 4 times per click, instead of 1 time.
    emit('complete', { 
        ...form
    })

    return
}

</script>
<template>
    <div
        data-testid="checkout-payment"
        class="md:px-4 py-6"
    >   
        <h2 class="text-neutral-900 text-lg font-bold mb-4">
            {{ $t("checkoutPayment.heading") }}
        </h2>
        <div>
            <form 
                data-testid="payment-method-form"
                class="space-y-4 grid gap-4 grid-cols-1"
            >
                <div v-if="allPaymentMethods.length > 0">
                    <label
                        v-for="method in allPaymentMethods"
                        class="relative"
                    >
                        <input
                            v-model="form.paymentMethodId"
                            type="radio"
                            name="payment_method"
                            class="peer sr-only"
                            :value="method.id"
                            @change="handleSubmit(method.id)"
                        />
                        <span
                            class="block h-20 flex flex-col items-center justify-center py-4 px-4 cursor-pointer rounded-md border border-neutral-200 -outline-offset-2 hover:border-primary-200 hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 active:border-primary-300 active:bg-primary-200 peer-checked:outline peer-checked:outline-2 peer-checked:outline-primary-700 peer-disabled:opacity-50 peer-disabled:bg-neutral-100 peer-disabled:border-neutral-200 peer-disabled:cursor-not-allowed peer-disabled:[&_img]:grayscale"
                        >
                            <NuxtImg
                                provider="odooProvider"
                                :src="method.image"
                                :width="39"
                                :height="26"
                                loading="lazy"
                            />
                            <span class="font-medium mt-2">{{ method.name }}</span>
                        </span>
                    </label>
                </div>
            </form>
        </div>
    </div>
</template>