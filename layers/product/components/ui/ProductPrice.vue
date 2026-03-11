<script setup lang="ts">
interface Props {
    specialPrice: number,
    regularPrice: number,
    hasDiscountedPrice: boolean,
    discPercentage: number,
    loading?: boolean
}

const props = defineProps<Props>()
</script>
<template>
    <div 
        class="h-full flex flex-col items-baseline min-h-[76px]"
        data-test="product-price"
    >
        <template v-if="!loading">
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
            <span class="text-[0.6rem] text-neutral-500 text-balance max-w-[100px]">
                {{ $t('productInfo.priceNote') }}
            </span>
        </template>
        <div v-else class="flex flex-col gap-2">
            <div class="h-8 bg-neutral-200 animate-pulse rounded w-32"></div>
            <div class="h-4 bg-neutral-200 animate-pulse rounded w-20"></div>
        </div>
    </div>
</template>