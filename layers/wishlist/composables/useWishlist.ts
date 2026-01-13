
import type {
  MutationWishlistAddItemArgs,
  MutationWishlistRemoveItemArgs,
  WishlistAddItemResponse,
  WishlistData,
  WishlistLoadResponse,
  WishlistRemoveItemResponse,
  WishlistItems,
} from "~/graphql";
import { MutationName } from "~/server/mutations";
import { QueryName } from "~/server/queries";
import { useToast } from 'vue-toastification'

export const useWishlist = () => {
  const { $sdk } = useNuxtApp()
  const loading = ref(false)
  const toast = useToast()
  const wishlist = useState<WishlistData>('wishlist', () => ({ wishlistItems: [], totalCount: 0 } as unknown as WishlistData))
  const fetchedOnce = useState<boolean>('wishlist-fetched-once', () => false)
  let inflight: Promise<void> | null = null

  const loadWishlist = async () => {
    if (import.meta.server) return
    if (fetchedOnce.value) return
    if (inflight) return await inflight

    loading.value = true

    inflight = $sdk().odoo
      .query({ queryName: QueryName.WishlistLoadQuery })
      .then((raw: unknown) => {
        const data = raw as WishlistLoadResponse
        const safe: WishlistItems = data?.wishlistItems ?? { totalCount: 0, wishlistItems: [] }
        wishlist.value = safe
        fetchedOnce.value = true
      })
      .catch((err: any) => {
        toast.error(err?.data?.message ?? 'Failed to load Wishlist.')
      })
      .finally(() => {
        loading.value = false
        inflight = null
      })

    await inflight

  }

  const wishlistAddItem = async (productId: number) => {
    try {
      loading.value = true
      const data = await $sdk().odoo.mutation<
        MutationWishlistAddItemArgs,
        WishlistAddItemResponse
      >({ mutationName: MutationName.WishlistAddItem }, { productId })

      wishlist.value = data?.wishlistAddItem
    } catch (error: any) {
      toast.error(error.data?.message)
    } finally {
      loading.value = false
    }
  }

  const getProductFromProductId = (productId: number) => {
    return wishlist.value?.wishlistItems?.find(
      (item) => item?.product?.id === productId
    )
  }

  const wishlistRemoveItem = async (productId: number) => {
    const wishlistItem = getProductFromProductId(productId)

    if (!wishlistItem) {
      return;
    }

    try {
      loading.value = true
      const data = await $sdk().odoo.mutation<
        MutationWishlistRemoveItemArgs,
        WishlistRemoveItemResponse
      >(
        { mutationName: MutationName.WishlistRemoveItem },
        { wishId: wishlistItem.id },
      )

      wishlist.value = data?.wishlistRemoveItem
    } catch (error: any) {
      toast.error(error.data?.message)
    } finally {
      loading.value = false
    }
  }

  const wishlistTotalItems = computed(() => {
    return wishlist.value?.wishlistItems?.length || 0;
  });

  const isInWishlist = (productId: number) => {
    if (!wishlist.value || !productId) return false

    return (
      wishlist.value?.wishlistItems?.some(
        (item) => item?.product?.id === productId
      ) || false
    );
  };

  return {
    loading,
    wishlist,
    wishlistTotalItems,

    isInWishlist,
    loadWishlist,
    wishlistAddItem,
    wishlistRemoveItem,
  };
};
