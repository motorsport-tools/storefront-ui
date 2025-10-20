<script setup lang="ts">
import {
    SfButton
} from '@storefront-ui/vue'
import type { CustomProductWithStockFromRedis } from '~/graphql'

interface Props {
    productVariant: CustomProductWithStockFromRedis
}
const props = defineProps<Props>()

const { isAuthenticated } = useAuth()

const { wishlistAddItem, isInWishlist, wishlistRemoveItem } = useWishlist()

const handleWishlistAddItem = async (firstVariant: CustomProductWithStockFromRedis) => {
  await wishlistAddItem(firstVariant.id)
}

const handleWishlistRemoveItem = async (firstVariant: CustomProductWithStockFromRedis) => {
  await wishlistRemoveItem(firstVariant.id)
}
</script>
<template>
    <div 
        v-if="isAuthenticated"
        class="flex justify-center"
    >
        <SfButton
            type="button"
            :title="isInWishlist(productVariant?.id as number)
                ? $t('wishlist.removeFromWishlist')
                : $t('wishlist.addProductToWishlist', { label: productVariant?.name })"
            size="sm"
            variant="tertiary"
            class="inline-flex h-8 border"
            :class="
                isInWishlist(productVariant?.id as number) ? 'bg-primary-100' : 'bg-white'
            "
            @click="
                isInWishlist(productVariant?.id as number)
                ? handleWishlistRemoveItem(productVariant)
                : handleWishlistAddItem(productVariant)
            "
        >
            <Icon 
                v-if="isInWishlist(productVariant?.id as number)"
                name="ic:outline-star"
                size="22px"
            />
            <Icon 
                v-else
                name="ic:outline-star-border"
                size="22px"
            />
            {{
                isInWishlist(productVariant?.id as number)
                ? $t('wishlist.removeFromWishlist')
                : $t('wishlist.addToWishlist')
            }}
        </SfButton>
    </div>
</template>