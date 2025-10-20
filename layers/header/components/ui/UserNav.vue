<script setup lang="ts">
import { SfBadge } from "@storefront-ui/vue"
const NuxtLink = resolveComponent("NuxtLink")
const { isAuthenticated } = useAuth()
const { totalItemsInCart } = useCart()

const { toggleWishlistSideBar } = useWishlistUiState();
const { loadWishlist, wishlistTotalItems } = useWishlist();

const handleOpenWishListSidebar = async () => {
  toggleWishlistSideBar()
  await loadWishlist()
}
</script>

<template>
    <UiUserNavButton
        v-if="isAuthenticated"
        class="group relative"
        :title="$t('wishlistLinkTitle')"
        @click="handleOpenWishListSidebar"
    >
        <Icon
            name="material-symbols:star"
            size="26px"
        />
        <SfBadge
            :content="wishlistTotalItems"
            placement="top-right"
            class="outline outline-primary-700 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center top-1"
            data-testid="wishlist-badge"
        />
    </UiUserNavButton>

    <UiUserNavButton
        class="group relative"
        :title="$t('cartLinkTitle')"
        to="/cart"
        :tag="NuxtLink"
    >
        <Icon 
            name="ri:shopping-basket-2-fill"
            size="26px"
        />
        <SfBadge
            :content="totalItemsInCart"
            placement="top-right"
            class="outline outline-primary-700 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center top-1"
            data-testid="cart-badge"
        />
    </UiUserNavButton>
</template>