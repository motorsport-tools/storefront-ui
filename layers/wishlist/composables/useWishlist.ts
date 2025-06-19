 
import type {
  MutationWishlistAddItemArgs,
  MutationWishlistRemoveItemArgs,
  WishlistAddItemResponse,
  WishlistData,
  WishlistLoadResponse,
  WishlistRemoveItemResponse,
} from "~/graphql";
import { MutationName } from "~/server/mutations";
import { QueryName } from "~/server/queries";
import { useToast } from 'vue-toastification'

export const useWishlist = () => {
  const { $sdk } = useNuxtApp()
  const loading = ref(false)
  const wishlist = useState<WishlistData>(
    "wishlist",
    () => ({} as WishlistData)
  )

  const toast = useToast()

  const loadWishlist = async () => {
    try {
      loading.value = true
      const data = await $sdk().odoo.query<
        MutationWishlistAddItemArgs,
        WishlistLoadResponse
      >({
        queryName: QueryName.WishlistLoadQuery,
      })
      wishlist.value = data?.wishlistItems || []
    }
    catch (error: any) {
      toast.error(error.data?.message)
    }
    finally {
      loading.value = false
    }
  }

  const wishlistAddItem = async (productId: number) => {
    try {
      loading.value = true
      const  data = await $sdk().odoo.mutation<
        MutationWishlistAddItemArgs,
        WishlistAddItemResponse
      >({ mutationName: MutationName.WishlistAddItem }, { productId })

      wishlist.value = data?.wishlistAddItem
    } catch (error:any) {
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
    } catch(error:any) {
      toast.error(error.data?.message)
    } finally {
      loading.value = false
    }
  }

  const wishlistTotalItems = computed(() => {
    return wishlist.value?.wishlistItems?.length || 0;
  });

  const isInWishlist = (productId: number) => {
    if(!wishlist.value || !productId) return false

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
