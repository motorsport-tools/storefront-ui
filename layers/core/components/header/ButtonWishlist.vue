<script lang="ts" setup>
import { SfButton, SfBadge } from "@storefront-ui/vue";

const { toggleWishlistSideBar } = useWishlistUiState();
const { loadWishlist, wishlistTotalItems } = useWishlist();

const handleOpenWishListSidebar = async () => {
  toggleWishlistSideBar()
  await loadWishlist()
}
</script>
<template>
  <ClientOnly>
    <SfButton
      class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
      type="button"
      variant="tertiary"
      square
      @click="handleOpenWishListSidebar"
    >
      <template #prefix>
        <Icon
          :name="wishlistTotalItems > 0 ? 'mdi:heart' : 'mdi:heart-outline'"
          size="22px"
        />
        <SfBadge
          :content="wishlistTotalItems"
          class="outline outline-primary-700 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center"
          data-testid="wishlist-badge"
        />
      </template>
    </SfButton>

    <template #fallback>
      <SfButton
        class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
        type="button"
        variant="tertiary"
        square
      >
        <template #prefix>
          <Icon
            name="mdi:heart-outline"
            size="22px"
          />
          <SfBadge
            :content="0"
            class="outline outline-primary-700 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center"
            data-testid="wishlist-badge"
          />
        </template>
      </SfButton>
    </template>
  </ClientOnly>
</template>
