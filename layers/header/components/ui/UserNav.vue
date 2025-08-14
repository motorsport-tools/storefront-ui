<script setup lang="ts">
const NuxtLink = resolveComponent("NuxtLink")
</script>

<template>
    <UiUserNavButton
        :title="$t('wishlistLinkTitle')"
    >
        <Icon
            name="material-symbols:star"
            size="26px"
        />
    </UiUserNavButton>

    <UiUserNavButton
        :title="$t('cartLinkTitle')"
        to="/cart"
        :tag="NuxtLink"
    >
        <Icon 
            name="ri:shopping-basket-2-fill"
            size="26px"
        />
    </UiUserNavButton>
</template>