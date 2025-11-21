<script setup lang="ts">
import type { EasyshipRate } from '~/graphql'
import { SfRadio } from "@storefront-ui/vue"

const props = defineProps<{
    rates: EasyshipRate[],
    modelValue: string | number | null
    summary?: Boolean
}>()

const { modelValue } = toRefs(props)

const emit = defineEmits<{
    'update:modelValue': (value: string | number | null) => void
}>()

const handleSelectRate = async (serviceId: string) => {
    emit('update:modelValue', serviceId)
}
</script>
<template>
    <table class="hidden md:block text-left typography-text-sm">
        <caption class="hidden">
            {{ $t("shippingMethod.rates.caption") }}
        </caption>
        <thead v-show="!summary" class="border-b-2 border-neutral-200">
                <tr>
                    <th class="py-4 px-4 font-medium"></th>
                    <th></th>
                    <th class="py-4 px-4 font-medium">{{ $t("shippingMethod.rates.service") }}</th>
                    <th class="py-4 px-4 font-medium text-right">{{ $t("shippingMethod.rates.price") }}</th>
                </tr>
        </thead>
        <tbody>
            <tr 
                v-for="rate in rates" 
                :key="rate.serviceId"
                v-show="!summary || (summary && modelValue === String(rate.serviceId))"
                class="border-b border-neutral-200 last:border-transparent cursor-pointer hover:bg-neutral-100 group"
                :class="{ 'bg-neutral-200': modelValue === String(rate.serviceId) }"
                @click="handleSelectRate(rate.serviceId)"
            >
                <td class="py-4 px-4">
                    <SfRadio 
                        v-model="modelValue" 
                        :value="String(rate.serviceId)" 
                        class="items-center"
                        :disabled="summary"
                    />
                </td>
                <td class="py-4 px-4">
                    <NuxtImg
                        :src="rate.courierLogoUrl"
                        :alt="rate.courierName"
                        width="90"
                        height="40"
                        class="max-w-none rounded-sm"
                    />
                </td>
                <td class="py-4 px-4 lg:whitespace-nowrap">
                    <p>
                        {{ rate.courierName }}
                    </p>
                    <p class="text-xs text-neutral-500">
                        {{ rate.deliveryDays }}
                    </p>
                </td>
                <td class="p-4 px-4 w-full text-right">
                    {{ $currency(rate.totalCharge) }}
                </td>
            </tr>
        </tbody>
    </table>
</template>