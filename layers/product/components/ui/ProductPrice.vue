<script setup lang="ts">
interface Props {
    specialPrice: number,
    regularPrice: number,
    hasDiscountedPrice: boolean
}
const props = defineProps<Props>()
</script>
<template>
    <div data-test="product-price" >   
        <span
            v-if="hasDiscountedPrice"
            class="mr-2 text-neutral-500 font-bold font-headings text-2xl"
            data-testid="price"
        >
            {{ $currency(specialPrice) }}
        </span>
        <span 
            :class="[ hasDiscountedPrice ? 'text-base font-normal text-neutral-200 line-through' : 'mr-2 text-neutral-500 font-bold font-headings text-3xl' ]"
        >
            {{ $currency(regularPrice) }}
        </span>
    </div>
</template>