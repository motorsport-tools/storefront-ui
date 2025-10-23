<script setup lang="ts">
interface Props {
    specialPrice: number,
    regularPrice: number,
    hasDiscountedPrice: boolean,
    discPercentage: number
}
/*
Regular Price = list_price (this is Sales Price On Product)
Special Price = PriceList price (Calculated)
*/
const props = defineProps<Props>()
</script>
<template>
    <div 
        class="h-full flex flex-col items-baseline"
        data-test="product-price"
    >
        Special: {{ specialPrice }}
        <br/> Regular: {{ regularPrice }}
        <span 
            v-if="discPercentage"
            class="inline-block mr-2 text-red-700 text-md"
        >
            {{ $t('productInfo.save') }} {{ discPercentage }}%
        </span>
        <span
            v-if="hasDiscountedPrice"
            class="inline-block mr-2 text-neutral-500 font-bold font-headings text-3xl"
            data-testid="price"
        >
            {{ $currency(specialPrice) }}
        </span>
        <div
            class="flex flex-row gap-1 items-center"
        >
            <span 
                v-if="hasDiscountedPrice"
                class="text-neutral-500 font-bold"
            >
                {{ $t('productInfo.was') }}
            </span>
            <span 
                class="inline-block"
                :class="[ hasDiscountedPrice ? 'text-base font-normal text-neutral-500 line-through' : 'text-neutral-500 font-bold font-headings text-3xl' ]"
            >
                {{ $currency(regularPrice) }}
            </span>
        </div>
    </div>
</template>