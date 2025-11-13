<script lang="ts" setup>
import type { Product, CustomProductWithStockFromRedis } from "~/graphql";
import { AisHits, AisPagination} from "vue-instantsearch/vue3/es";
</script>

<template>
    <AisHits>
        <template #default="{ items, banner, sendEvent }">
            <section 
                class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8"
            >
                <LazyUiProductCard
                    v-for="product in items"
                    :key="product?.id"
                    :pid="pid"
                    :isSearch="true"
                    :slug=" mountUrlSlugForProductVariant(product.firstVariant as Product || product as Product) || '' "
                    :name="product?.name || ''"
                    :sku="product?.sku || ''"
                    :brand="product?.brand"
                    :regular-price="product.on_sale ? product.list_price : 0"
                    :special-price="product.price"
                    :rating-count="product.ratingCount || 0"
                    :rating="product.rating || 0"
                    :first-variant="product as unknown as CustomProductWithStockFromRedis"
                    :image-alt="product?.name || ''"
                    :image-url="
                        $getImage(
                        `${String(product.image_slug)}`,
                        370,
                        370,
                        String(product.imageFilename),
                        )
                    "
                />                
            </section>
            <SearchPagination
                class="mt-5"
            />
        </template>
    </AisHits>
</template>