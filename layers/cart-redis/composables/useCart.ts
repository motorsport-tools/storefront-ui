import type {
  Cart,
  CartAddItemResponse,
  CartRemoveItemResponse,
  CartResponse,
  Product,
  CartUpdateItemResponse,
  UpdateCartAddressResponse,
  MutationCartAddMultipleItemsArgs,
  MutationCartRemoveMultipleItemsArgs,
  MutationCartUpdateMultipleItemsArgs,
  MutationUpdateCartAddressArgs,
  AddressInput,
} from "~/graphql"
import { MutationName } from "~/server/mutations"
import { useToast } from "vue-toastification"
import { CartToast } from "#components"



export const useCart = () => {
  const { $sdk } = useNuxtApp()
  const { $i18n } = useNuxtApp()
  const toast = useToast()
  const cart = useState<Cart>("cart", () => ({}) as Cart)
  const frequentlyTogetherProducts = useState<Product[]>('frequently-together-products', () => [])

  const loading = useState<Object>('cartLoading', () => ({
    loading: false,
  }))

  const loadCart = async () => {
    try {
      loading.value = true

      const data = await $fetch<{ cart: Cart }>(`/api/odoo/cart-load`)

      if (!data?.cart)
        return

      cart.value = data.cart || ({} as Cart)
      frequentlyTogetherProducts.value = (data.cart?.frequentlyBoughtTogether || []).filter((p): p is Product => p !== null)
    } catch (error: any) {
      return toast.error(error?.data?.message)
    } finally {
      loading.value = false
    }
  }

  const cartAdd = async (id: number, quantity: number) => {
    const params: MutationCartAddMultipleItemsArgs = {
      products: [{ id, quantity }],
    }

    try {
      loading.value = true

      const data = await $sdk().odoo.mutation<MutationCartAddMultipleItemsArgs, CartAddItemResponse>(
        { mutationName: MutationName.CartAddItem }, params,
      )

      cart.value = data.cartAddMultipleItems || ({} as Cart)

      toast.success({
        component: CartToast,
        props: {
          message: $i18n.t('cartAddProduct')
        }
      })
    } catch (error: any) {
      return toast.error(error?.data?.message)
    } finally {
      loading.value = false
    }
  }

  const updateItemQuantity = async (id: number, quantity: number) => {

    const params: MutationCartUpdateMultipleItemsArgs = {
      lines: [{ id, quantity }],
    };

    try {
      loading.value = true;

      const data = await $sdk().odoo.mutation<MutationCartUpdateMultipleItemsArgs, CartUpdateItemResponse>(
        { mutationName: MutationName.CartUpdateQuantity }, params,
      )

      cart.value = data.cartUpdateMultipleItems || ({} as Cart)

      toast.success({
        component: CartToast,
        props: {
          message: $i18n.t('cartUpdateProduct')
        }
      })
    } catch (error: any) {
      return toast.error(error?.data?.message)
    } finally {
      loading.value = false
    }
  }

  const removeItemFromCart = async (lineId: number) => {
    const params: MutationCartRemoveMultipleItemsArgs = {
      lineIds: [lineId],
    }

    try {
      loading.value = true

      const data = await $sdk().odoo.mutation<MutationCartRemoveMultipleItemsArgs, CartRemoveItemResponse>(
        { mutationName: MutationName.CartRemoveItem }, params,
      )
      cart.value = data.cartRemoveMultipleItems || ({} as Cart)
      toast.success({
        component: CartToast,
        props: {
          message: $i18n.t('cartRemoveProduct')
        }
      })
    } catch (error: any) {
      return toast.error(error?.data?.message)
    } finally {
      loading.value = false
    }
  }

  const updateCartAddress = async (type: 'delivery' | 'billing', address: AddressInput, sameAddress: boolean = false) => {

    const params: MutationUpdateCartAddressArgs = {
      addressType: type,
      address: address,
      useSameAddress: sameAddress
    }

    loading.value = true;
    const { data, error } = await $sdk().odoo.mutation<
      MutationUpdateCartAddressArgs,
      UpdateCartAddressResponse
    >({ mutationName: MutationName.UpdateCartAddress }, params);
    loading.value = false;

    if (data.value.updateCartAddress.success) {
      cart.value = data.value?.updateCartAddress?.cart || ({} as Cart)
      return true
    }

    if (error.value) {
      return toast.error(data.value.updateCartAddress.error || 'Failed to update address');
    }
  }

  const totalItemsInCart = computed(() =>
    cart.value?.order?.orderLines?.filter((l) => !l.coupon && !l.isDelivery && !l.isRewardLine).reduce((total, line) => total + line.quantity, 0) || 0
  )

  const cartIsEmpty = computed(() => !cart.value.order?.orderLines?.filter((l) => !l.coupon && !l.isDelivery && !l.isRewardLine).length);

  const cartHasDiscount = computed(() => cart.value.order?.coupons?.length || false);

  return {
    loading,
    loadCart,
    cartAdd,
    updateItemQuantity,
    removeItemFromCart,
    frequentlyTogetherProducts,
    cart,
    totalItemsInCart,
    cartIsEmpty,
    cartHasDiscount,
    updateCartAddress,
  };
};
