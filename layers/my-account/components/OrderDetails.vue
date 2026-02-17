<script setup lang="ts">
import { SfButton, SfLoaderCircular, SfIconDownload, SfIconArrowBack, SfIconInfo } from "@storefront-ui/vue";
import type { Order, OrderLine, Rma } from "~/graphql";

const props = defineProps<{
  order: Order;
  isGuest?: boolean;
}>();

const { open: openRmaModal } = useRmaModal();

const showReturnButton = computed(() => {
    return !props.isGuest && props.order.isRmaEligible;
});

const linesWithoutUndefinedProducts = computed(() => {
    return props.order.reportOrderLine?.filter((item: OrderLine) => item.product !== null)
});

const invoiceLines = computed(() => {
    return props.order.invoiceIds?.filter((item) => item.id !== null)
});

const deliveryLines = computed(() => {
    return (props.order as any).deliveryOrders?.filter((item: any) => item.id !== null) || [];
});

const rmaLines = computed(() => {
    return (props.order as any).rmas?.filter((item: Rma) => item.id !== null) || [];
});

const hasOpenRma = computed(() => {
    return rmaLines.value.some((rma: Rma) => rma.state !== 'done' && rma.state !== 'cancel');
});

const NuxtLink = resolveComponent("NuxtLink");
</script>

<template>
    <div v-if="order" class="flex flex-col gap-4 md:gap-y-6 col-span-full">
        <UiDivider class="w-screen -mx-4 md:w-auto md:mx-0" />
        
        <div class="flex flex-wrap items-center justify-between gap-4">
            <h2 class="typography-headline-3 font-bold">
                {{ $t("account.myOrders.orderDetails.heading") }} #{{ order?.id }}
            </h2>

            <div class="flex gap-2">
                <SfButton
                    v-if="!isGuest"
                    variant="tertiary"
                    :tag="NuxtLink"
                    :to="{
                        name: 'my-account-my-orders',
                        query: { page: 1 }
                    }"
                >
                    {{ $t("account.myOrders.backToOrders") }}
                </SfButton>
                
                <SfButton
                    v-if="order?.orderUrl"
                    variant="secondary"
                    :tag="NuxtLink"
                    :to="order.orderUrl ? `${order.orderUrl}&report_type=pdf` : ''"
                    target="_blank"
                >
                    <SfIconDownload/>
                    {{ $t("account.myOrders.viewDetails") }}
                </SfButton>

                <SfButton
                    v-if="showReturnButton"
                    variant="secondary"
                    @click="openRmaModal"
                >
                    <template #prefix>
                        <SfIconArrowBack size="base" class="rotate-90" />
                    </template>
                    {{ $t("rma.button") }}
                </SfButton>
            </div>
        </div>
        
        <div>
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
                    <p><span>{{ order?.dateOrder ? new Date(order.dateOrder).toLocaleDateString('en-GB') : '--' }}</span></p>
                </li>
                <li>
                    <p class="font-medium">
                        {{ $t("account.myOrders.orderDetails.paymentAmount") }}
                    </p>
                    <p><span>{{ $currency(Number(order?.amountTotal)) }}</span></p>
                </li>
                <li class="mt-4">
                    <p class="font-medium">
                        {{ $t("account.myOrders.orderDetails.status") }}
                    </p>
                    <p><span>{{ order?.lastTransaction ? order?.lastTransaction?.state : "--" }}</span></p>
                </li>
            </ul>


            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Invoices -->
                <div v-if="invoiceLines && invoiceLines.length > 0">
                    <table class="w-full text-left typography-text-sm">
                        <thead>
                            <tr class="border-b-2 border-neutral-200">
                                <th class="py-3 font-medium">
                                    {{ $t("account.myOrders.lastInvoices.heading") }}
                                </th>
                                <th class="py-3 px-4 font-medium text-center">
                                    {{ $t("account.myOrders.lastInvoices.status") }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(line, i) in invoiceLines" :key="i" class="border-b border-neutral-200 align-top">
                                <td class="py-4 pr-4">
                                    <p class="text-base font-medium">
                                        <NuxtLink
                                            class="text-primary-700 hover:underline"
                                            :to="`${line.invoiceUrl}&report_type=pdf`"
                                            target="_blank"
                                        >
                                            {{ line.name }}
                                        </NuxtLink>
                                    </p>
                                    <p class="text-xs text-neutral-500">
                                        Invoice Date: {{ line.invoiceDate ? new Date(line.invoiceDate).toLocaleDateString('en-GB') : '--' }}
                                    </p>
                                </td>
                                <td class="p-4 flex justify-center">
                                    <InvoiceStatus :status="(line.paymentState as any)"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Deliveries -->
                <div v-if="deliveryLines && deliveryLines.length > 0">
                    <table class="w-full text-left typography-text-sm">
                        <thead>
                            <tr class="border-b-2 border-neutral-200">
                                <th class="py-3 font-medium">
                                    {{ $t("deliveries.section.heading") }}
                                </th>
                                <th class="py-3 px-4 font-medium text-center">
                                    {{ $t("deliveries.section.status") }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(delivery, i) in deliveryLines" :key="i" class="border-b border-neutral-200 align-top">
                                <td class="py-4 pr-4">
                                    <p class="text-base font-medium">
                                        {{ delivery.name }}
                                    </p>
                                    <p class="text-xs text-neutral-600 mb-1">
                                        {{ delivery.isClickAndCollectOrder ? $t('deliveries.section.clickAndCollect') : $t('deliveries.section.shipment') }}
                                    </p>
                                    <p v-if="delivery.dateDone" class="text-xs text-neutral-500">
                                        {{ delivery.isClickAndCollectOrder ? $t('deliveries.section.collectedOn') : $t('deliveries.section.doneDate') }}: {{ new Date(delivery.dateDone).toLocaleDateString('en-GB') }}
                                    </p>
                                    <p v-else-if="delivery.scheduledDate" class="text-xs text-neutral-500">
                                        {{ $t('deliveries.section.scheduledDate') }}: {{ new Date(delivery.scheduledDate).toLocaleDateString('en-GB') }}
                                    </p>
                                </td>
                                <td class="p-4 flex justify-center">
                                    <DeliveryStatus :status="delivery.state" :is-click-and-collect="delivery.isClickAndCollectOrder"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- RMAs -->
                <div v-if="rmaLines && rmaLines.length > 0">
                    <table class="w-full text-left typography-text-sm">
                        <thead>
                            <tr class="border-b-2 border-neutral-200">
                                <th class="py-3 font-medium">
                                    {{ $t("rma.section.heading") }}
                                </th>
                                <th class="py-3 px-4 font-medium text-center">
                                    {{ $t("rma.section.status") }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(rma, i) in rmaLines" :key="i" class="border-b border-neutral-200 align-top">
                                <td class="py-4 pr-4">
                                    <p class="text-base font-medium">
                                        {{ rma.name }}
                                    </p>
                                    <p class="text-xs text-neutral-500">
                                        {{ $t('rma.section.requestedOn') }}: {{ rma.date ? new Date(rma.date).toLocaleDateString('en-GB') : '--' }}
                                    </p>
                                </td>
                                <td class="p-4 flex justify-center">
                                    <RmaStatus :status="(rma.state as any)"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Order Items Table -->
            <div class="overflow-x-auto">
                <table class="w-full text-left typography-text-sm min-w-[600px]">
                    <thead>
                        <tr class="border-b-2 border-neutral-200">
                            <th class="py-3 font-medium">
                                {{ $t("account.myOrders.orderDetails.product") }}
                            </th>
                            <th class="py-3 px-4 font-medium text-right">
                                {{ $t("account.myOrders.orderDetails.price") }}
                            </th>
                            <th class="py-3 px-4 font-medium text-center">
                                {{ $t("account.myOrders.orderDetails.quantity") }}
                            </th>
                            <th class="py-3 px-4 font-medium text-right">
                                {{ $t("account.myOrders.orderDetails.subtotal") }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(line, i) in linesWithoutUndefinedProducts" :key="i" class="border-b border-neutral-200 align-top">
                            <td class="py-4 pr-4">
                                <ProductCardHorizontal v-if="line.product" :product="line.product" />
                            </td>
                            <td class="p-4 text-right typography-text-base">
                                {{ $currency(Number(line.priceUnit)) || "--" }}
                            </td>
                            <td class="p-4 text-center typography-text-base">
                                {{ line.quantity || "--" }}
                            </td>
                            <td class="p-4 text-right typography-text-base font-medium">
                                {{ $currency(Number(line.priceSubtotal)) || "--" }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Order Totals -->
            <div class="flex flex-col items-end mt-6 gap-2">
                <div class="flex justify-between w-full max-w-xs">
                    <p>{{ $t("account.myOrders.orderDetails.itemsSubtotal") }}</p>
                    <span class="font-medium">{{ $currency(Number(order?.amountSubtotal)) }}</span>
                </div>
                <div class="flex justify-between w-full max-w-xs">
                    <p>{{ $t("account.myOrders.orderDetails.delivery") }}</p>
                    <span class="font-medium">{{ $currency(Number(order?.amountDelivery)) }}</span>
                </div>
                <div class="flex justify-between w-full max-w-xs border-b pb-2 border-neutral-200">
                    <p>{{ $t("account.myOrders.orderDetails.estimatedTax") }}</p>
                    <span class="font-medium">{{ $currency(Number(order?.amountTax)) }}</span>
                </div>
                <div class="flex justify-between w-full max-w-xs pt-2 typography-text-lg font-bold">
                    <p>{{ $t("account.myOrders.orderDetails.total") }}</p>
                    <span>{{ $currency(Number(order?.amountTotal)) }}</span>
                </div>
            </div>
        </div>

        <RmaModal
            v-if="showReturnButton"
            :order="order"
        />
    </div>
</template>
