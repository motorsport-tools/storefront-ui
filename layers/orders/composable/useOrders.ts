import type {
  GetOrderResponse,
  GetOrdersResponse,
  Order,
  Orders,
  QueryOrderArgs,
  QueryOrdersArgs,
} from "~/graphql";
import { QueryName } from "~/server/queries";

export const useOrders = () => {
  const { $sdk } = useNuxtApp();
  const loading = ref(false);
  const orders = ref<Orders>();
  const order = ref<Order>();
  const totalOrders = ref(0);

  const getOrders = async (params: QueryOrdersArgs) => {
    loading.value = true;
    try {
      const data = await $sdk().odoo.queryNoCache<QueryOrdersArgs, GetOrdersResponse>(
        { queryName: QueryName.GetOrdersQuery },
        params
      );
      orders.value = (data?.orders as Orders) || {};
      totalOrders.value = data?.orders?.totalCount || 0;
    } catch {

    } finally {
      loading.value = false;
    }
  };

  const getOrderById = async (params: QueryOrderArgs) => {
    loading.value = true;
    try {
      const data = await $sdk().odoo.queryNoCache<QueryOrderArgs, GetOrderResponse>(
        { queryName: QueryName.GetOrderQuery },
        params
      );
      order.value = data?.order || ({} as Order);
    } finally {
      loading.value = false;
    }
  };

  const getGuestOrder = async (res_id: number | null = null, pid: number | null = null, model: string | null = null, access_token: string | null = null) => {
    loading.value = true
    try {
      const data = await $sdk().odoo.queryNoCache(
        { queryName: QueryName.GetGuestOrderQuery },
        {
          res_id: Number(res_id),
          pid: Number(pid),
          model,
          access_token: access_token
        }
      )
      order.value = data?.guestOrder as Order || ({} as Order);

    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    getOrders,
    getOrderById,
    getGuestOrder,
    orders,
    order,
    totalOrders
  };
};
