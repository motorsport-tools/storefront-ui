<script setup lang="ts">
import { SfButton, SfLoaderCircular, SfIconCheckCircle } from "@storefront-ui/vue";
import { useOrders } from "~/layers/orders/composable/useOrders";
import {
  PaymentTransactionState,
  type QueryOrdersArgs,
  type Order,
  type PaymentTransaction,
  SortEnum,
} from "~/graphql";

definePageMeta({
  layout: "account",
  middleware: ["auth-check"],
});

const { getOrders, orders, loading, totalOrders } = useOrders();
const route = useRoute();
const router = useRouter();
const viewport = useViewport()

//pagination states
const currentPage = ref(1);
const perPage = ref(10);


const fetchOrders = async () => {
  const params: QueryOrdersArgs = {
    currentPage: currentPage.value,
    pageSize: perPage.value,
    sort: { dateOrder: SortEnum.Desc },
  };
  await getOrders(params);
};

onMounted(async () => {
  const page = route.query.page ? Number(route.query.page) : 1;
  currentPage.value = page;
  await fetchOrders();
});

watch(
  () => route.query.page,
  async (newPage) => {
    if (newPage && Number(newPage) !== currentPage.value) {
      currentPage.value = Number(newPage);
      await fetchOrders();
    }
  }
);

const isTransactionCancelled = (
  transaction?: PaymentTransaction | null
): boolean => {
  return transaction?.state === PaymentTransactionState.Canceled;
};

const getLastOrderTransaction = (order: Order): PaymentTransaction | null => {
  return order.transactions?.[0] ?? null;
};

const getActiveRma = (order: Order | null | undefined) => {
    if (!order) return null;
    const rmas = (order as any).rmas || [];
    // Show the first RMA that is not done or cancelled, or just the first one
    return rmas.find((rma: any) => rma.state !== 'done' && rma.state !== 'cancel') || rmas[0];
};

const NuxtLink = resolveComponent("NuxtLink");

const ordersList = computed(() => orders.value?.orders || []);
</script>

<template>
  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
  <h2 class="hidden md:block typography-headline-4 font-bold mx-4 capitalize">
    {{ $t("account.myOrders.heading") }}
  </h2>
  <div v-if="loading" class="w-full text-center">
    <SfLoaderCircular size="xl" class="mt-[160px]" />
  </div>
  <div v-else-if="orders?.orders && orders.orders.length > 0" class="col-span-3">
    <div class="flex justify-between items-center mx-4">
      <div class="bg-gray-100 text-sm ml-auto px-4 py-2 rounded-md">
        <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> -
        <span class="font-medium">{{ Math.min(currentPage * perPage, totalOrders) }}</span> of <span class="font-medium">{{ totalOrders }}</span>
      </div>
    </div>
    <template v-if="viewport.isLessThan('md') && ordersList.length > 0">
      <ul v-for="(order, index) in ordersList" :key="index" class="my-4 last-of-type:mb-0">
        <li>
          <p class="block typography-text-sm font-medium">{{ $t('account.myOrders.orderId') }}</p>
          <span class="block typography-text-sm mb-2">{{ order?.name }}</span>
        </li>
        <li>
          <p class="block typography-text-sm font-medium">
            {{ $t("account.myOrders.orderDate") }}
          </p>
          <span class="block typography-text-sm mb-2">{{ order?.dateOrder }}</span>
        </li>
        <li>
          <p class="block typography-text-sm font-medium">{{ $t("account.myOrders.amount") }}</p>
          <span class="block typography-text-sm mb-2">{{ $currency(order?.amountTotal ? order?.amountTotal : 0) }}</span>
        </li>
        <!--
        <li v-if="orderGetters.getShippingDate(order, locale)">
          <p class="block typography-text-sm font-medium">{{ t('account.ordersAndReturns.shippingDate') }}</p>
          <span class="block typography-text-sm mb-2">{{ orderGetters.getShippingDate(order, locale) }}</span>
        </li>
        -->
        <li class="flex flex-wrap items-center mb-2">
          
          <UiAlert 
              v-if="order && order.locked"
              class="font-semibold mr-4"
              variant="neutral"
            >
            <SfIconCheckCircle class="text-positive-700 shrink-0" size="sm" />
            {{ $t("account.myOrders.done") }}
          </UiAlert>
          <template v-if="order && getActiveRma(order)">
              <RmaStatus :status="getActiveRma(order).state" class="mr-4" />
          </template>
          <SfButton
            :tag="NuxtLink"
            size="sm"
            variant="tertiary"
            :to="`/my-account/my-orders/${order?.id}`"
          >
            {{ $t("account.myOrders.details") }}
          </SfButton>
        </li>
        <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
      </ul>
    </template>
    <table class="hidden md:block text-left typography-text-sm mx-4">
      <caption class="hidden">
        List of orders
      </caption>
      <thead class="border-b-2 border-neutral-200">
        <tr>
          <th class="py-4 pr-4 font-medium">
            {{ $t("account.myOrders.orderId") }}
          </th>
          <th class="py-4 px-4 font-medium lg:whitespace-nowrap">
            {{ $t("account.myOrders.orderDate") }}
          </th>
          <th class="py-4 px-4 font-medium">
            {{ $t("account.myOrders.amount") }}
          </th>
          <th class="py-4 px-4 font-medium">
            
          </th>
          <th class="py-4 pl-4"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in ordersList"
          :key="order?.id ?? 0"
          class="border-b border-neutral-200 last:border-transparent"
        >
          <td class="py-4 pr-4 lg:whitespace-nowrap">{{ order?.name }}</td>
          <td class="p-4 lg:whitespace-nowrap">{{ order?.dateOrder }}</td>
          <td class="p-4">
            {{ $currency(order?.amountTotal ? order?.amountTotal : 0) }}
          </td>
          <td class="p-4 w-full">
            <UiAlert 
              v-if="order && order.locked"
              class="font-semibold"
              variant="neutral"
            >
                <SfIconCheckCircle class="text-positive-700 shrink-0" size="sm" />
                {{ $t("account.myOrders.confirmed") }}
            </UiAlert>
            <template v-if="order && getActiveRma(order)">
                <RmaStatus :status="getActiveRma(order).state" />
            </template>
          </td>
          <td class="py-1.5 pl-4 text-right">
            <SfButton
                v-if="order"
              :tag="NuxtLink"
              size="sm"
              variant="tertiary"
              :to="`/my-account/my-orders/${order.id}`"
            >
              {{ $t("account.myOrders.details") }}
            </SfButton>
          </td>
        </tr>
      </tbody>
    </table>

    <LazyUiPagination
      :currentPage="currentPage"
      :pageSize="perPage"
      :totalItems="totalOrders"
      :maxVisiblePages="5"
    />
  </div>
  <div v-else-if="orders?.orders?.length === 0" class="col-span-3 text-center mt-8">
    <NuxtImg
      src="/img/basket-empty.png"
      :alt="$t('account.myOrders.noOrdersAltText')"
      width="300"
      height="300"
      class="mx-auto"
      loading="lazy"
    />
    <h3 class="typography-headline-3 font-bold mb-4 mt-6">
      {{ $t("account.myOrders.noOrders") }}
    </h3>
    <SfButton variant="secondary" class="!ring-neutral-200" :tag="NuxtLink" :to="`/search`">
      {{ $t("account.myOrders.continue") }}</SfButton
    >
  </div>
</template>
