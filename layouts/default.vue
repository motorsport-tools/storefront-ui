<script lang="ts" setup></script>

<template>
  <!--
  <TheHeader />
  -->
  <SiteHeader />
  <div>
  <slot></slot>
  </div>
  
  <LazyNewsletter />
  <LazyBottomNavbar hydrate-on-visible />
  <LazyTheFooter hydrate-on-visible />
  <WishlistSidebar />
  
</template>
