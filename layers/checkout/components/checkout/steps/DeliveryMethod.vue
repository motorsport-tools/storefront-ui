<script setup lang="ts">
import type { Cart, ShippingMethod } from '~/graphql';
import { SfIconWarehouse, SfIconLocalShipping, SfIconBlock, SfListItem, SfRadio } from "@storefront-ui/vue"

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
      await loadDeliveryMethods()
    }
  },
  { immediate: false }
)

const emit = defineEmits<{
    complete: [data: Record<string, any>]
    update: [data: Record<string, any>]
}>()

const { deliveryMethods, loadDeliveryMethods, setDeliveryMethod } = useDeliveryMethod()
const { isCollectEligible } = useCart();

const form = reactive({
    deliveryMethod: props.exData?.id || null
})

const getShippingIcon = (methodName: String) => {
    if (methodName.toLowerCase().includes("click & collect")) {
        return SfIconWarehouse;
    }
    if (methodName.toLowerCase().includes("delivery") || methodName.toLowerCase().includes("pallet")) {
        return SfIconLocalShipping;
    }
    return null;
}

onMounted(async () => {
    if (props.stepData) {
        Object.assign(form, props.stepData)
    }
    if(props.steps?.find(s => s.id == 'delivery-method').completed) {
        await loadDeliveryMethods()
    }
})

const handleSubmit = async () => {
    if(form.deliveryMethod) {
        await setDeliveryMethod(form.deliveryMethod)
        emit('complete', { ...form })
    }
}

</script>
<template>
    <div name="summary" v-show="showSummary">
        <div class="mt-2 md:w-[520px]">
            <ul
                v-if="deliveryMethods.length"
                class="grid gap-y-4 md:grid-cols-2 md:gap-x-4"
                role="radiogroup"
            >
                <SfListItem
                    v-for="{ id, name, estimatedDelivery } in deliveryMethods"
                    v-show="id === form.deliveryMethod"
                    :key="id"
                    tag="label"
                    class="border rounded-md items-start"
                >
                    <div class="flex gap-2 items-center">
                        <SfRadio 
                            v-model="form.deliveryMethod" 
                            :value="id" 
                            class="items-center"
                            disabled
                        />
                        <div class="mr-2">
                            <p
                                :class="form.deliveryMethod === id ? 'text-primary-700 font-semibold' : 'text-neutral-600'"
                            >
                                {{ name }}
                            </p>
                        
                            <p class="text-xs text-neutral-500">
                                {{ $t("shippingMethod.deliveryTime.estimate") }} {{ estimatedDelivery }}
                            </p>
                        </div>
                        <component
                            :is="getShippingIcon(name)"
                            class="ml-auto flex items-center"
                            :class="form.deliveryMethod === id ? 'text-primary-700' : 'text-neutral-600'"
                            size="lg"
                        />
                    </div>
                </SfListItem>
            </ul>
        </div>
    </div>
    <div v-show="!showSummary">
        <form 
            data-testid="delivery-method-form"
            @submit.prevent="handleSubmit"
            class="space-y-4 md:w-[520px]"
        >
            <ul
                v-if="deliveryMethods.length"
                class="grid gap-y-4 md:grid-cols-2 md:gap-x-4"
                role="radiogroup"
            >
                <SfListItem
                    v-for="{ id, name, estimatedDelivery } in deliveryMethods"
                    v-show="(isCollectEligible && name?.includes('Collect')) || !name?.includes('Collect')"
                    :key="id"
                    tag="label"
                    class="border rounded-md items-start"
                >
                    <div class="flex gap-2 items-center">
                        <SfRadio 
                            v-model="form.deliveryMethod" 
                            :value="id" 
                            class="items-center"
                        />
                        <div class="mr-2">
                            <p
                                :class="form.deliveryMethod === id ? 'text-primary-700 font-semibold' : 'text-neutral-600'"
                            >
                                {{ name }}
                            </p>
                        
                            <p class="text-xs text-neutral-500">
                                {{ $t("shippingMethod.deliveryTime.estimate") }} {{ estimatedDelivery }}
                            </p>
                        </div>
                        <component
                            :is="getShippingIcon(name)"
                            class="ml-auto flex items-center"
                            :class="form.deliveryMethod === id ? 'text-primary-700' : 'text-neutral-600'"
                            size="lg"
                        />
                    </div>
                </SfListItem>
            </ul>
            <div v-else class="flex mb-6">
                <SfIconBlock class="mr-2 text-neutral-500" />
                <p>{{ $t("shippingMethod.description") }}</p>
            </div>

            <button 
                type="submit"
                class="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
                Continue
            </button>
        </form>
    </div>
</template>