<script lang="ts" setup>
import { SfButton, SfBadge } from "@storefront-ui/vue"

const NuxtLink = resolveComponent("NuxtLink")
const { totalItemsInCart } = useCart()

const isMounted = ref(false)
onMounted(() => {
    isMounted.value = true
})

const displayCount = computed(() => isMounted.value ? totalItemsInCart.value : 0)

</script>

<template>
    <SfButton
        class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md"
        :tag="NuxtLink"
        to="/cart"
        variant="tertiary"
        square
    >
        <template #prefix>
        <Icon
            :name="displayCount > 0 ? 'ion:cart-sharp' : 'ion:cart-outline'"
            size="22px"
        />
        <SfBadge
            :content="displayCount"
            class="outline outline-primary-700 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center"
            data-testid="cart-badge"
        />
        </template>
    </SfButton>
</template>