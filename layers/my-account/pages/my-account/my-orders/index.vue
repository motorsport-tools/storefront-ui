<script setup lang="ts">
import { SfButton, SfLoaderCircular, SfIconCheckCircle } from "@storefront-ui/vue";
import { useOrders } from "~/layers/orders/composable/useOrders";
import {
  PaymentTransactionState,
  type QueryOrderArgs,
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
    if (newPage && newPage !== currentPage.value) {
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

const NuxtLink = resolveComponent("NuxtLink");
</script>

<template>
  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
  <h2 class="hidden md:block typography-headline-4 font-bold mx-4 capitalize">
    {{ $t("account.myOrders.heading") }}
  </h2>
  <div v-if="loading" class="w-full text-center">
    <SfLoaderCircular size="xl" class="mt-[160px]" />
  </div>
  <div v-else-if="orders?.orders.length > 0" class="col-span-3">
    <div class="flex justify-between items-center mx-4">
      <div class="bg-gray-100 text-sm ml-auto px-4 py-2 rounded-md">
        <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> -
        <span class="font-medium">{{ Math.min(currentPage * perPage, totalOrders) }}</span> of <span class="font-medium">{{ totalOrders }}</span>
      </div>
    </div>
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
          v-for="order in orders.orders"
          :key="order?.id"
          class="border-b border-neutral-200 last:border-transparent"
        >
          <td class="py-4 pr-4 lg:whitespace-nowrap">{{ order?.name }}</td>
          <td class="p-4 lg:whitespace-nowrap">{{ order?.dateOrder }}</td>
          <td class="p-4">
            {{ $currency(order?.amountTotal ? order?.amountTotal : 0) }}
          </td>
          <td class="p-4">
            <UiAlert 
              v-if="order.locked"
              class="font-semibold"
            >
            <SfIconCheckCircle class="text-positive-700 shrink-0" size="sm" />
            {{ $t("account.myOrders.done") }}
            </UiAlert>
          </td>
          <td class="py-1.5 pl-4 text-right w-full">
            <SfButton
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
      src="/images/empty-cart.svg"
      :alt="$t('account.myOrders.noOrdersAltText')"
      width="192"
      height="192"
      class="mx-auto"
      loading="lazy"
    />
    <h3 class="typography-headline-3 font-bold mb-4 mt-6">
      {{ $t("account.myOrders.noOrders") }}
    </h3>
    <SfButton variant="secondary" class="!ring-neutral-200">
      {{ $t("account.myOrders.continue") }}</SfButton
    >
  </div>
</template>
