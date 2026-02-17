<script setup lang="ts">
import { useOrders } from '~/layers/orders/composable/useOrders'
import { SfLoaderCircular } from '@storefront-ui/vue';
definePageMeta({
  layout: "default",
  middleware: ["token"],
});

const route = useRoute()
const { access_token, model, pid } = route.query
const res_id = Number(route.params?.id)

const { getGuestOrder, order, loading } = useOrders()

onMounted(async () => {
  await getGuestOrder(Number(res_id), Number(pid), String(model), String(access_token))
})

</script>
<template>
<main class="w-full narrow-container bg-white mb-20 px-4 pt-4 pb-20 md:px-0 md:mt-4">
    <OrderDetails v-if="order && !loading" :order="order" :is-guest="true" />
    <div v-else class="flex items-center justify-center h-full text-center col-span-3">
        <SfLoaderCircular size="xl" class="mt-[160px]" />
    </div>
</main>
</template>