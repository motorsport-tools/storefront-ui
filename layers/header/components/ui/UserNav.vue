<script setup lang="ts">
import { Icon } from '#components'
const NuxtLink = resolveComponent("NuxtLink")

console.log('NuxtLink?',NuxtLink)
</script>

<template>
    <UiUserNavButton
        title="'View Wishlist'"
    >
        <Icon
            name="weui:search-filled"
            size="26px"
        />
    </UiUserNavButton>
    <UiUserNavButton
        title="'View Wishlist'"
    >
        <Icon
            name="material-symbols:star"
            size="26px"
        />
    </UiUserNavButton>

    <UiUserNavButton
        title="'View Shopping Basket'"
        to="cart"
        :tag="NuxtLink"
    >
        <Icon 
            name="ri:shopping-basket-2-fill"
            size="26px"
        />
    </UiUserNavButton>
</template>