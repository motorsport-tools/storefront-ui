import type {
  Cart,
  CartAddItemResponse,
  CartRemoveItemResponse,
  CartResponse,
  Product,
  CartUpdateItemResponse,
  MutationCartAddMultipleItemsArgs,
  MutationCartRemoveMultipleItemsArgs,
  MutationCartUpdateMultipleItemsArgs,
  MutationUpdateCartAddressArgs,
  AddressEnum,
  ExpressAddressInput,
  ApplyDiscountsResponse,
  MutationApplyGiftCardArgs,
  MutationApplyCouponArgs,
} from "~/graphql"
import { MutationName } from "~/server/mutations"
import { useToast } from "vue-toastification"
import { CartToast } from "#components"
import ShippingMethod from "~/server/mutations/ShippingMethod";



export const useCart = () => {
  const { $sdk } = useNuxtApp()
  const { $i18n } = useNuxtApp()
  const toast = useToast()
  const cart = useState<Cart>("cart", () => ({}) as Cart)
  const frequentlyTogetherProducts = useState<Product[]>('frequently-together-products', () => [])

  const loading = useState<boolean>('cartLoading', () => false)

  const loadCart = async (full: boolean = false) => {
    try {
      loading.value = true

      const data = await $fetch<{ cart: Cart }>(`/api/odoo/cart-load`, {
        method: 'POST',
        body: { fullSync: full }
      })

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
      //loading.value = true;

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
      //loading.value = false
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

  const updateCartAddress = async (type: AddressEnum, address: any, sameAddress: boolean = false) => {

    const params: MutationUpdateCartAddressArgs = {
      addressType: type,
      address: address,
      useSameAddress: sameAddress
    }

    loading.value = true;
    const data: any = await $sdk().odoo.mutation<
      MutationUpdateCartAddressArgs,
      any
    >({ mutationName: MutationName.UpdateCartAddress }, params);
    loading.value = false;

    if (data?.updateCartAddress?.success) {
      cart.value = data?.updateCartAddress?.cart || ({} as Cart)
      return true
    }

    if (data?.updateCartAddress?.error) {
      return toast.error(data?.updateCartAddress?.error || 'Failed to update address');
    }
  }

  const totalItemsInCart = computed(() =>
    cart.value?.order?.orderLines?.filter((l) => !l.coupon && !l.isDelivery && !l.isRewardLine).reduce((total, line) => total + (line.quantity || 0), 0) || 0
  )

  const cartIsEmpty = computed(() => !cart.value.order?.orderLines?.filter((l) => !l.coupon && !l.isDelivery && !l.isRewardLine).length);

  const cartHasDiscount = computed(() => cart.value.order?.coupons?.length || cart.value.order?.orderLines?.filter((l) => l.isRewardLine || l.coupon).length || false);

  const shippingMethod = computed(() => cart.value?.order?.shippingMethod?.id || 0)

  const isCollectEligible = computed(() => {
    if (!cart.value?.order?.orderLines)
      return false

    return cart.value?.order?.orderLines?.filter((l) => !l.coupon && !l.isDelivery && !l.isRewardLine).every(line => line?.product?.isInStock)
  })

  const applyDiscount = async (promoCode: string) => {

    loading.value = true

    const params: MutationApplyGiftCardArgs = {
      promo: promoCode
    }
    let result: any = await $sdk().odoo.mutation<
      MutationApplyGiftCardArgs,
      ApplyDiscountsResponse
    >({ mutationName: MutationName.ApplyGiftCardMutation }, params)

    if (result?.applyGiftCard) {
      cart.value = result.applyGiftCard
    } else {
      result = await $sdk().odoo.mutation<
        MutationApplyCouponArgs,
        ApplyDiscountsResponse
      >({ mutationName: MutationName.ApplyCouponMutation }, params);

      if (result?.applyCoupon) {
        cart.value = result.applyCoupon
      }
    }

    loading.value = false
  }

  const clearCart = async () => {
    cart.value = {} as Cart
  }

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
    shippingMethod,
    isCollectEligible,
    updateCartAddress,
    applyDiscount,
    clearCart
  };
};
