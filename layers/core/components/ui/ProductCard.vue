<script lang="ts" setup>
import {
  SfRating,
  SfCounter,
  SfButton,
  SfIconSell,
  SfIconShoppingCart,
} from '@storefront-ui/vue'
import type { CustomProductWithStockFromRedis, Product } from '~/graphql'

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: false,
  },
  slug: {
    type: String,
    required: true,
  },
  ratingCount: {
    type: Number,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  specialPrice: {
    type: Number,
    required: false,
    default: null,
  },
  brand: {
    type: String,
    default: null,
  },
  firstVariant: {
    type: Object as PropType<CustomProductWithStockFromRedis>,
    required: false,
  },
  loading: {
    type: String as PropType<'eager' | 'lazy' | undefined>,
    required: false,
    default: 'lazy',
  },
  pid: {
    type: Number,
    default: 4,
  },
  isSearch: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n()
const { cartAdd } = useCart()
const { isAuthenticated } = useAuth()
const { wishlistAddItem, isInWishlist, wishlistRemoveItem } = useWishlist()

const handleWishlistAddItem = async (firstVariant: CustomProductWithStockFromRedis) => {
  await wishlistAddItem(firstVariant.id)
}

const handleWishlistRemoveItem = async (firstVariant: CustomProductWithStockFromRedis) => {
  await wishlistRemoveItem(firstVariant.id)
}

const handleWishListClick = async (firstVariant: CustomProductWithStockFromRedis) => {
  isInWishlist(firstVariant?.id)
          ? handleWishlistRemoveItem(firstVariant as CustomProductWithStockFromRedis)
          : handleWishlistAddItem(firstVariant as CustomProductWithStockFromRedis)
}

const wishlistButtonTitle = (id: number | undefined) => {
  return isInWishlist(id) ? t('wishlist.removeFromWishlist') : t('wishlist.addToWishlist')
}

const isStock = computed(() => {
    if(props.isSearch) {
      return Boolean(props.firstVariant?.has_stock)
    }
    return Boolean(props.firstVariant?.stock > 0 || props.firstVariant?.['allow_out_of_stock_order'])
})

let price = props.specialPrice
let listPrice = props.regularPrice
let onSale = !!props.regularPrice
if(props.firstVariant?.pricelist_ids) {
  const index = props.firstVariant?.pricelist_ids.indexOf(props.pid)
  if (index !== -1 && props.pid !== 4) {
    price = props.firstVariant?.pricelist_prices[index]
    listPrice = props.firstVariant?.pricelist_list_prices[index]
    onSale = props.firstVariant?.pricelist_on_sale[index]
  }
}
</script>

<template>
  <div
    class="product_card relative hover:shadow-lg min-h-[330px] flex flex-col justify-around min-w-[190px] max-w-[250px] mb-6"
  > 
    <div class="relative">
      <NuxtLink :to="slug" class="product__img" :title="name">
        <NuxtImg
          :src="imageUrl"
          :alt="imageAlt"
          :width="370"
          :height="370"
          :loading="loading"
        />
      </NuxtLink>
      <UiProductCardRibbon
        :isOnSale="!!regularPrice"
        size="xs"
        class="absolute top-0 left-0 p-2"
      />
      <SfButton
        v-if="isAuthenticated"
        type="button"
        variant="tertiary"
        size="sm"
        square
        :class="[
          'absolute top-0 right-0 mr-2 mt-2 bg-white border border-neutral-200 !rounded-full',
          { '!bg-green-200': isInWishlist(firstVariant?.id) },
        ]"
        aria-label="Add to wishlist"
        @click="handleWishListClick(firstVariant as CustomProductWithStockFromRedis)"
        :title="wishlistButtonTitle(firstVariant?.id)"
      >
        <Icon 
          v-if="isInWishlist(firstVariant?.id)"
          name="ic:outline-star"
          size="16px"
        />
        <Icon 
          v-else
          name="ic:outline-star-border"
          size="16px"
        />
      </SfButton>
    </div>
    <div
      class="p-2 border-t border-neutral-200 typography-text-sm flex flex-col justify-between gap-1 h-full"
    >
      <NuxtLink
        :to="slug"
        variant="secondary"
        class="no-underline self-start text-left"
        :title="name"  
      >
        <span class="product_card__brand">{{ brand }}</span>
        <span class="product_card__title block text-neutral-700">{{ name }}</span>
        <span class="product_card__sku block pb-1 border-b border-neutral-200 text-neutral-700">{{ sku }}</span>
      </NuxtLink>
      <div class="flex items-center mb-2">
        <SfRating
          size="xs"
          :value="rating"
          :max="5"
        />
        <SfCounter
          class="ml-1"
          size="xs"
        >
          {{ ratingCount }}
        </SfCounter>
      </div>
      <div class="flex justify-between">
        <div class="block">
          <span class="font-bold typography-text-sm">{{
            $currency(price)
          }}</span>
          <span
            v-if="regularPrice"
            class="ml-1.5 font-normal typography-text-xs line-through"
          >{{ $currency(listPrice) }}</span>
        </div>
        <SfButton
          type="button"
          class="ottom-2"
          size="sm"
          :disabled="!isStock"
          @click="cartAdd(firstVariant?.id, 1)"
        >
          <template #prefix>
            <SfIconShoppingCart size="sm" />
          </template>
          Add
        </SfButton>
      </div>
    </div>
    
  </div>
</template>
<style>

.product_card:hover .product__img::after {
  background-color: rgba(19, 6, 6, 0.08);
}

.product_card__brand {
  display: block;
  font-weight: 600;
  height: 1.25rem;
}
.product_card__title {
  text-wrap: balance;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  height: calc(1.25rem * 2 + 0.25rem);
}
.product_card__sku {
  font-size:0.75rem;
}
</style>