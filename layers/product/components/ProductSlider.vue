<script setup lang="ts">
import { SfScrollable } from '@storefront-ui/vue';
import type { Product } from '~/graphql';

defineProps({
  heading: String || null || undefined
});

const { loadProductTemplateList, loading, productTemplateList } = useProductTemplateList('');
const { getRegularPrice, getSpecialPrice } = useProductAttributes();

const numOfProducts = 10;
await loadProductTemplateList({ pageSize: numOfProducts });
</script>

<template>
  <h2 v-if="heading" class="text-center mb-6 font-bold typography-headline-3 md:typography-headline-2 block">
    {{ heading }}
  </h2>
  <div>
  <SfScrollable
    v-if="productTemplateList.length > 0"
    buttons-placement="floating"
    class="items-center pb-4"
    data-testid="product-slider"
  >
    <LazyUiProductCard
      v-for="productTemplate in productTemplateList"
      :key="productTemplate.id"
      class="min-w-[190px]"
      :slug="mountUrlSlugForProductVariant(productTemplate.firstVariant as Product) || ''"
      :name="productTemplate?.name || ''"
      :image-url="$getImage(String(productTemplate.image), 370, 370, String(productTemplate.imageFilename))"
      :image-alt="productTemplate?.name || ''"
      :regular-price="getRegularPrice(productTemplate.firstVariant as Product)"
      :special-price="getSpecialPrice(productTemplate.firstVariant as Product)"
      :is-in-wishlist="productTemplate?.isInWishlist || false"
      :rating-count="productTemplate?.ratingCount || 0"
      :rating="productTemplate?.rating || 0"
      :first-variant="productTemplate.firstVariant as Product"
    />
  </SfScrollable>
  </div>
</template>