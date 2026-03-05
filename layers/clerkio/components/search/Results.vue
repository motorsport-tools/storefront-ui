<script lang="ts" setup>
import type { Product, CustomProductWithStockFromRedis } from "~/graphql";
import { AisHits} from "vue-instantsearch/vue3/es";

const props = defineProps({
    isCategoryPage: {
        type: Boolean,
        default: false
    }
})

const { Pid } = useAuth()

const clickProduct = (e: Event, p: number,  n: number) => {  
  if (typeof window !== 'undefined' && window.Clerk) {
    window.Clerk('call', 'log/click', {
      visitor: useCookie('clerk_visitor').value || 'auto',
      api: 'search/products',
      n: n,
      labels: props.isCategoryPage ? ['Category page'] : ['Search page'],
      product: p
    })
  }
}
</script>

<template>
    <AisHits>
        <template #default="{ items, banner, sendEvent }">
            <section 
                class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8"
            >
                <LazyUiProductCard
                    v-for="product, i in items"
                    @click="clickProduct($event, product.id, i)"
                    :data-clerk-product-id="product.id"
                    :key="product?.id"
                    :pid="Pid"
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
                    :ribbon-id="product.ribbon_id"
                    :ribbon-html="product.ribbon_html"
                    :ribbon-bg-color="product.ribbon_bg_color"
                    :ribbon-text-color="product.ribbon_text_color"
                />                
            </section>
            <SearchPagination
                class="mt-5"
            />
        </template>
    </AisHits>
</template>