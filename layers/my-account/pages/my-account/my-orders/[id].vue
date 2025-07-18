<script setup lang="ts">
import { SfButton, SfLoaderCircular, SfIconDownload } from "@storefront-ui/vue";

definePageMeta({
  layout: "account",
  middleware: ["auth-check"],
});

import { useOrders } from "~/layers/orders/composable/useOrders";

const route = useRoute();
const { getOrderById, order } = useOrders();

onMounted(async () => {
    await getOrderById({ id: parseInt(route.params.id) });
});

const linesWithoutUndefinedProducts = computed(() => {
    return order.value?.reportOrderLine?.filter((item) => item.product !== null);
});

const invoiceLines = computed(() => {
    return order.value?.invoiceIds?.filter((item) => item.id !== null)
})

const NuxtLink = resolveComponent("NuxtLink");
</script>
<template>
    <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
    <h2 class="typography-headline-3 font-bold">
        {{ $t("account.myOrders.orderDetails.heading") }} #{{ order?.id }}
    </h2>
    <!-- Button to go back to the orders list -->
    <SfButton
        variant="tertiary"
        :tag="NuxtLink"
        :to="{
            name: 'my-account-my-orders',
            query: { page: 1 }
        }"
        class="col-start-3 col-span-1 justify-self-end"
    >
        {{ $t("account.myOrders.backToOrders") }}
    </SfButton>
    <div v-if="order" class="col-span-3">
        <SfButton
            v-if="order?.orderUrl"
            variant="secondary"
            :tag="NuxtLink"
            :to="`${order.orderUrl}&report_type=pdf`"
            :prefetch-on="{ interaction: true }"
            target="_blank"
        >
        <SfIconDownload/>
        {{ $t("account.myOrders.viewDetails") }}
        </SfButton>
    </div>
    
    <div v-if="order" class="col-span-3">
        <!-- Order Overview -->
        <ul class="bg-neutral-100 p-4 rounded-md md:columns-2 mb-6">
            <li>
            <p class="font-medium">
                {{ $t("account.myOrders.orderDetails.orderId") }}
            </p>
            <p><span>{{ order?.name }}</span></p>
            </li>
            <li class="my-4 md:mb-0">
            <p class="font-medium">
                {{ $t("account.myOrders.orderDetails.orderDate") }}
            </p>
            <p><span>{{ order?.dateOrder }}</span></p>
            </li>
            <li>
            <p class="font-medium">
                {{ $t("account.myOrders.orderDetails.paymentAmount") }}
            </p>
            <p><span>{{ $currency(order?.amountTotal) }}</span></p>
            </li>
            <li class="mt-4">
            <p class="font-medium">
                {{ $t("account.myOrders.orderDetails.status") }}
            </p>
            <p><span>{{ order?.lastTransaction ? order?.lastTransaction?.state : "--" }}</span></p>
            </li>
        </ul>

        <div v-if="order.invoiceIds?.length > 0 " class="block mb-6">
            <div class="grid grid-cols-1 2xs:grid-cols-2 gap-4 md:gap-y-6 md:gap-x-2 md:grid-cols-2 lg:grid-cols-2 3xl:grid-cols-2 md:mb-5">
                <table class="hidden md:table col-span-1 w-full text-left typography-text-sm mx-4 md:mx-0">
                    <caption class="hidden">
                        {{ $t("account.myOrders.lastInvoices.tableCaption") }}
                    </caption>
                    <thead>
                        <tr class="border-b-2 border-neutral-200">
                            <th class="py-3 font-medium">
                                <p>
                                    {{ $t("account.myOrders.lastInvoices.heading") }}
                                </p>
                            </th>
                            <th class="py-3 px-4 font-medium">
                                <span class="invisible">
                                    {{ $t("account.myOrders.lastInvoices.status") }}
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(line, i) in invoiceLines" :key="i" class="border-b border-neutral-200 align-top">
                            <td class="pb-4 pr-4 lg:whitespace-nowrap typography-text-base">
                                <p class="text-lg pt-2">
                                    <NuxtLink
                                        class="text-primary-700"
                                        :to="`${line.invoiceUrl}&report_type=pdf`"
                                        :title="`${$t('account.myOrders.lastInvoices.details')} ${line.name}`"
                                        :prefetch="true"
                                        :prefetch-on="{ interaction: true }"
                                        target="_blank"
                                    >
                                        {{ line.name }}
                                    </NuxtLink>
                                </p>
                                <p class="text-sm">
                                    Date: <span class="text-neutral-600">{{ line.invoiceDate }}</span>
                                </p>
                            </td>
                            <td class="p-4 lg:whitespace-nowrap typography-text-base flex flex-col items-center">
                                <InvoiceStatus :status="line.paymentState"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="col-span-1">

                </table>
            </div>
        </div>

        <!-- Order Items Table -->
        <table class="hidden md:table w-full text-left typography-text-sm mx-4 md:mx-0">
            <caption class="hidden">
                {{ $t("account.myOrders.orderDetails.tableCaption") }}
            </caption>
            <thead>
            <tr class="border-b-2 border-neutral-200">
                <th class="py-3 font-medium">
                    {{ $t("account.myOrders.orderDetails.product") }}
                </th>
                <th class="py-3 px-4 font-medium lg:whitespace-nowrap">
                    {{ $t("account.myOrders.orderDetails.price") }}
                </th>
                <th class="py-3 px-4 font-medium">
                    {{ $t("account.myOrders.orderDetails.quantity") }}
                </th>
                <th class="py-3 px-4 font-medium">
                    {{ $t("account.myOrders.orderDetails.subtotal") }}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(line, i) in linesWithoutUndefinedProducts" :key="i" class="border-b border-neutral-200 align-top">
                <td class="pb-4 pr-4 lg:whitespace-nowrap typography-text-base">
                    <ProductCardHorizontal v-if="line.product" :product="line.product" />
                </td>
                <td class="p-4 lg:whitespace-nowrap typography-text-base">
                    {{ $currency(Number(line.product?.combinationInfo.price)) || "--" }}
                </td>
                <td class="p-4 typography-text-base">
                    {{ line.quantity || "--" }}
                </td>
                <td class="p-4 typography-text-base">
                    {{ $currency(Number(line.priceSubtotal)) || "--" }}
                </td>
            </tr>
            </tbody>
        </table>

        <!-- Order Totals -->
        <div class="flex justify-between pt-4 border-t border-neutral-200 md:border-0">
            <p>{{ $t("account.myOrders.orderDetails.itemsSubtotal") }}</p>
            <span>{{ $currency(Number(order?.amountSubtotal)) }}</span>
        </div>
        <div class="flex justify-between my-2">
            <p>{{ $t("account.myOrders.orderDetails.delivery") }}</p>
            <span>{{ $currency(Number(order?.amountDelivery)) }}</span>
        </div>
        <div class="flex justify-between border-b pb-4 border-neutral-200">
            <p>{{ $t("account.myOrders.orderDetails.estimatedTax") }}</p>
            <span>{{ $currency(Number(order?.amountTax)) }}</span>
        </div>
        <div class="flex justify-between pt-4 typography-text-lg font-medium">
            <p>{{ $t("account.myOrders.orderDetails.total") }}</p>
            <span>{{ $currency(Number(order?.amountTotal)) }}</span>
        </div>
    </div>
    <div v-else class="flex items-center justify-center w-full text-center col-span-3">
        <SfLoaderCircular size="xl" class="mt-[160px]" />
    </div>
</template>
