<script setup lang="ts">
import { useOrders } from "~/layers/orders/composable/useOrders";
import { SfLoaderCircular } from '@storefront-ui/vue';
definePageMeta({
  layout: "account",
  middleware: ["auth-check"],
});

const route = useRoute();
const { getOrderById, order } = useOrders();

onMounted(async () => {
    const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
    await getOrderById({ id: parseInt(id) });
});

</script>
<template>
    <OrderDetails v-if="order" :order="order" />
    <div v-else class="flex items-center justify-center w-full text-center col-span-3">
        <SfLoaderCircular size="xl" class="mt-[160px]" />
    </div>
</template>
