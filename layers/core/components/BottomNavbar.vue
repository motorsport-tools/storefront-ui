<script setup lang="ts">
import {
  SfBadge,
  SfButton,
  SfIconFavorite,
  SfIconHome,
  SfIconPerson,
  SfIconShoppingCart,
  useDisclosure,
} from "@storefront-ui/vue";

const { toggleWishlistSideBar } = useWishlistUiState();
const { loadWishlist, wishlistTotalItems } = useWishlist();

const { totalItemsInCart } = useCart();

const NuxtLink = resolveComponent("NuxtLink");

const isActive = ref(false);
const setIsActive = (param: boolean) => {
  isActive.value = param;
};

const handleWishlistSideBar = async () => {
  toggleWishlistSideBar()
  await loadWishlist()
};
</script>

<template>
  <nav
    class="w-full fixed bottom-0 left-0 flex flex-row items-stretch lg:hidden"
    data-testid="navbar-bottom"
  >
    <SfButton
      key="home"
      variant="tertiary"
      :class="[
        '!p-1 !pt-3 flex flex-col h-full w-full rounded-none bg-primary-700 text-white hover:text-white hover:bg-primary-800 active:text-white active:bg-primary-900 !text-xs !font-base',
        { 'text-white bg-primary-900': $route.path === '/' && !isActive },
      ]"
      size="sm"
      :tag="NuxtLink"
      to="/"
      @click="setIsActive(false)"
    >
      <template #prefix>
        <div class="relative">
          <SfIconHome />
        </div>
      </template>
      {{ $t("home") }}
    </SfButton>

    <SfButton
      key="wishlist"
      variant="tertiary"
      :class="[
        '!p-1 !pt-3 flex flex-col h-full w-full rounded-none bg-primary-700 text-white hover:text-white hover:bg-primary-800 active:text-white active:bg-primary-900 !text-xs !font-base',
        { 'text-white bg-primary-900': isActive },
      ]"
      size="sm"
      @click="handleWishlistSideBar"
    >
      <template #prefix>
        <div class="relative">
          <SfIconFavorite />
          <SfBadge
            v-if="wishlistTotalItems"
            :content="wishlistTotalItems"
            class="outline-white bg-white !text-neutral-900 translate-x-[5px] translate-y-[-3px]"
          />
        </div>
      </template>
      {{ $t("wishlist.wishlist") }}
    </SfButton>
    <SfButton
      key="cart"
      variant="tertiary"
      :class="[
        '!p-1 !pt-3 flex flex-col h-full w-full rounded-none bg-primary-700 text-white hover:text-white hover:bg-primary-800 active:text-white active:bg-primary-900 !text-xs !font-base',
        { 'text-white bg-primary-900': $route.path === '/cart' && !isActive },
      ]"
      size="sm"
      :tag="NuxtLink"
      to="/cart"
      @click="setIsActive(false)"
    >
      <template #prefix>
        <div class="relative">
          <SfIconShoppingCart />
          <SfBadge
            :content="totalItemsInCart"
            class="outline-white bg-white !text-neutral-900 translate-x-[5px] translate-y-[-3px]"
          />
        </div>
      </template>
      {{ $t("cart") }}
    </SfButton>
    <SfButton
      key="account"
      variant="tertiary"
      :class="[
        '!p-1 !pt-3 flex flex-col h-full w-full rounded-none bg-primary-700 text-white hover:text-white hover:bg-primary-800 active:text-white active:bg-primary-900 !text-xs !font-base',
        {
          'text-white bg-primary-900':
            $route.path === '/my-account' && !isActive,
        },
      ]"
      size="sm"
      :tag="NuxtLink"
      to="/my-account"
      @click="setIsActive(false)"
    >
      <template #prefix>
        <div class="relative">
          <SfIconPerson />
        </div>
      </template>
      account
    </SfButton>
  </nav>
</template>
