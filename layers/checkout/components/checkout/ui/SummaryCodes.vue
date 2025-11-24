<script setup lang="ts">
const props = defineProps({
    discount: Object
})

const noCode = ['next_order_coupons', 'promotion']

const { removeItemFromCart } = useCart()
const removeLine = (id:number) => {
    removeItemFromCart(id)
}
</script>
<template>
    <div class="flex justify-between mb-2">
        <div class="flex grow pr-2">
            <p class="text-sm text-gray-500 ml-2">
                {{ discount.name }}
            </p>
            <p v-if="discount?.programType && !noCode.includes(discount.programType)" class="flex grow text-sm text-gray-500 ml-2">
                {{ discount.code }}
            </p>
        </div>
        <p v-if="discount.priceSubtotal" class="flex text-right text-sm text-gray-500">
            {{  $currency(Number(discount.priceSubtotal)) }}
        </p>
    </div>
    <button
        class="self-start text-xs text-red-500 hover:underline"
        v-if="discount.isLine"
        @click="removeLine(discount.id)"
        title="Remove Discount"
    >
        Remove
    </button>
</template>
