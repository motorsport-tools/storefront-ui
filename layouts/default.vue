<script lang="ts" setup>
import { SfButton } from '@storefront-ui/vue'
</script>

<template>
    <!--
    <TheHeader />
    -->
    <SiteHeader />
    <div>
      <SfButton>
            <template #prefix>
              Prefix >
            </template>
            Test is it the component? 
            <template #suffix>
              < Suffix
            </template>
      </SfButton>
    <slot></slot>
    </div>
    <!--
    <LazyNewsletter />
    <LazyBottomNavbar hydrate-on-visible />
    <LazyTheFooter hydrate-on-visible />
    <WishlistSidebar />
    -->
</template>
