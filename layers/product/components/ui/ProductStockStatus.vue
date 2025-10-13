<script setup lang="ts">
import {
    SfIconCheckCircle,
    SfIconCancel
} from '@storefront-ui/vue'
interface Props {
    stock: number,
    showAvailability: boolean,
    availableThreshold: number,
    isStock: boolean,
}
const props = defineProps<Props>()

</script>
<template>
    <div class="flex flex-row align-center justify-between">
        <div 
            class="flex flex-row items-center text-sm uppercase font-bold py-1"
            :class="{'text-green-500': isStock, 'text-red-500': !isStock}"
            data-test="stock-status"
        >
            <SfIconCheckCircle v-if="isStock" size="sm" />
            <SfIconCancel v-else size="sm" />
            <span class="ml-1 mr-2">{{ $t(`stock.${isStock}`) }}</span>
        </div>
        <div 
            v-if="showAvailability && stock <= availableThreshold && stock >= 1"
            class="py-1 px-1 text-xs text-center border rounded text-neutral-600 bg-neutral-100"
            data-text="stock-message"
        >
            {{ $t('stock.availability', { stock }) }}
        </div>
    </div>
</template>