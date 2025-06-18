<script lang="ts" setup>
import { SfButton } from '@storefront-ui/vue'
</script>

<template>
  <!--
  <TheHeader />
  -->
  <SiteHeader />
  <div>
  <slot></slot>
  </div>
  <!--
  <LazyNewsletter />
  <LazyBottomNavbar hydrate-on-visible />
  <LazyTheFooter hydrate-on-visible />
  <WishlistSidebar />
  -->
</template>
