<script setup lang="ts">
const props = defineProps({
    product: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    query: {
        type: String,
        required: true
    },
    pid: {
        type: Number,
    }
})

let price = props.product.price
let listPrice = props.product.list_price
let onSale = props.product.on_sale

if(props.product.pricelist_ids) {
  const index = props.product.pricelist_ids.indexOf(props.pid)
  if (index !== -1 && props.pid !== 4) {
    price = props.product.pricelist_prices[index]
    listPrice = props.product.pricelist_list_prices[index]
    onSale = props.product.pricelist_on_sale[index]
  }
}

const clickProduct = (e: Event, p: number,  n: number) => {  
  if (import.meta.client && typeof window !== 'undefined' && window.Clerk) {
      window.Clerk('call', 'log/click', {
        visitor: useCookie('clerk_visitor').value || 'auto',
        api: 'search/omni',
        n: n,
        labels: ['Search bar'],
        product: p
      })
  }
  return true
}
</script>

<template>
    <NuxtLink :to="product.slug"
        :data-clerk-product-id="product.id"
        @click="clickProduct($event, product.id, index)"
        class="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 w-full border-b border-neutral-200"
    >
        <NuxtImg 
            :src="product.image_slug"
            :alt="product.name" 
            class="w-12 h-12 object-cover rounded" 
            provider="odooProvider"
            width="48"
            height="48"
        />
        <div class="text-sm grow">
            <h4 class="font-semibold">{{ product.name }}</h4>
            <p class="text-gray-600 text-xs">{{ product.sku }}</p>
        </div>
        <div class="flex items-center flex-col justify-center shrink">
          <span class="font-bold typography-text-md">{{
            $currency(price)
          }}</span>
          <span
            v-if="onSale"
            class="font-normal typography-text-xs line-through"
          >{{ $currency(listPrice) }}</span>
        </div>
    </NuxtLink>
</template>