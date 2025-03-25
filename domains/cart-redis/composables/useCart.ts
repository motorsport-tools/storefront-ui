import type {
  Cart,
  CartAddItemResponse,
  CartLineInput,
  CartRemoveItemResponse,
  CartResponse,
  CartUpdateItemResponse,
  MutationCartAddMultipleItemsArgs,
  MutationCartRemoveMultipleItemsArgs,
  MutationCartUpdateMultipleItemsArgs,
} from "~/graphql";
import { MutationName } from "~/server/mutations";
import { QueryName } from "~/server/queries";
import { useToast } from "vue-toastification";

export const useCart = () => {
  const { $sdk } = useNuxtApp();
  const toast = useToast();
  const cart = useState<Cart>("cart", () => ({}) as Cart);
  const loading = ref(false);

  const loadCart = async (skipCache: boolean) => {
    loading.value = true;
    if (skipCache) {
      const data = await $fetch<{ cart: Cart }>(`/api/odoo/cart-load`);
      cart.value = data?.cart || ({} as Cart);
      loading.value = false;
      return
    }


    const { data } = await useFetch<{ cart: Cart }>(`/api/odoo/cart-load`);
    loading.value = false;

    cart.value = data?.value?.cart || ({} as Cart);
  };

  const cartAdd = async (id: number, quantity: number) => {
    loading.value = true;

    const params: MutationCartAddMultipleItemsArgs = {
      products: [{ id, quantity }],
    };

    const { data, error } = await $sdk().odoo.mutation<
      MutationCartAddMultipleItemsArgs,
      CartAddItemResponse
    >({ mutationName: MutationName.CartAddItem }, params);
    loading.value = false;

    if (error.value) {
      return toast.error(error.value.data.message);
    }

    cart.value = data.value.cartAddMultipleItems;

    toast.success("Product has been added to cart");
  };

  const updateItemQuantity = async (id: number, quantity: number) => {
    loading.value = true;

    const params: MutationCartUpdateMultipleItemsArgs = {
      lines: [{ id, quantity }],
    };

    const { data, error } = await $sdk().odoo.mutation<
      MutationCartUpdateMultipleItemsArgs,
      CartUpdateItemResponse
    >({ mutationName: MutationName.CartUpdateQuantity }, params);
    loading.value = false;

    if (error.value) {
      return toast.error(error.value.data.message);
    }

    cart.value = data.value.cartUpdateMultipleItems;
    toast.success("Product updated successfully");
  };

  const removeItemFromCart = async (lineId: number) => {
    const params: MutationCartRemoveMultipleItemsArgs = {
      lineIds: [lineId],
    };

    loading.value = true;
    const { data, error } = await $sdk().odoo.mutation<
      MutationCartRemoveMultipleItemsArgs,
      CartRemoveItemResponse
    >({ mutationName: MutationName.CartRemoveItem }, params);
    loading.value = false;

    if (error.value) {
      return toast.error(error.value.data.message);
    }

    cart.value = data.value.cartRemoveMultipleItems;
    toast.success("Product removed successfully");
  };

  const totalItemsInCart = computed(() =>
    cart.value?.order?.orderLines?.filter((l) => !l.coupon).reduce((total, line) => total + line.quantity, 0) || 0
  );

  const cartIsEmpty = computed(() => !cart.value.order?.orderLines?.length);

  const cartHasDiscount = computed(() => cart.value.order?.coupons?.length || false);

  return {
    loading,
    loadCart,
    cartAdd,
    updateItemQuantity,
    removeItemFromCart,
    cart,
    totalItemsInCart,
    cartIsEmpty,
    cartHasDiscount,
  };
};
