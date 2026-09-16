<script setup lang="ts">
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import UiProductCard from '~/layers/core/components/ui/ProductCard.vue'
import UiProductCardSkeleton from '~/layers/core/components/ui/ProductCardSkeleton.vue'

import type { CustomProductWithStockFromRedis, Product } from '~/graphql'

const props = defineProps({
  heading: String,
  productTemplateList: {
    type: Array<Product>,
    default: () => [],
  },
  blockId: Number,
  loading: {
    type: Boolean,
    default: false,
  }
})
const { getRegularPrice, getSpecialPrice } = useProductAttributes()

const sliderRef = ref()
const wrapperRef = ref()
const sliderOptions = computed(() => ({
  ignoreAnimations: true,
  itemsToScroll: 1,
  clamp: true,
  gap: 10,
  slideEffect: 'slide',
  touchDrag: true,
  transition: 300,
  wrapAround: props.productTemplateList.length > 1,
  snapAlign: 'start',
  breakpoints: {
    0: {
      itemsToShow: 1,
      snapAlign: 'start',
    },
    430: {
      itemsToShow: 2,
      snapAlign: 'start',
    },
    768: {
      itemsToShow: 3,
      snapAlign: 'start',
    },
    1024: {
      itemsToShow: 5,
      snapAlign: 'start',
    },
  },
}))

const SliderInit = async () => {
  await nextTick()
  if(wrapperRef.value) {
    wrapperRef.value.classList?.remove('loading')
  }
}

const { Pid } = useAuth()

const clickProduct = (e: Event, p: number, n: number) => {  
  if (typeof window !== 'undefined' && window.Clerk) {
    window.Clerk('call', 'log/click', {
      visitor: useCookie('clerk_visitor').value || 'auto',
      api: 'search/products',
      n: n,
      labels: ['Product Slider'],
      product: p
    })
  }
}
</script>

<template>
  <h2
    v-if="heading"
    class="text-center mb-6 font-bold typography-headline-3 md:typography-headline-2 block"
  >
    {{ heading }}
  </h2>
  <div ref="wrapperRef" class="loading w-full min-h-[380px] md:min-h-[410px] overflow-hidden">
    <Carousel
      v-if="productTemplateList && productTemplateList.length > 0 && !loading"
      v-bind="sliderOptions"
      ref="sliderRef"
      class="product_slider"
      aria-roledescription="carousel"
      @init="SliderInit"
    >
      <Slide
        v-for="(product, index) in productTemplateList"
        :key="product?.id || index"
        aria-roledescription="slide"
      >
          <UiProductCard
              @click="clickProduct($event, product.id, index)"
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
              :image-url="product.image_slug"
              :ribbon-id="product.ribbon_id"
              :ribbon-html="product.ribbon_html"
              :ribbon-bg-color="product.ribbon_bg_color"
              :ribbon-text-color="product.ribbon_text_color"
          />
      </Slide>

      <template #addons>
        <Navigation
          v-if="productTemplateList.length > (sliderRef?.data?.config?.itemsToShow || 1)"
        >
          <template #prev>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false"><path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path></svg>
          </template>
          <template #next>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false"><path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path></svg>
          </template>
        </Navigation>
      </template>
    </Carousel>
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 min-h-[380px] py-4"
    >
      <UiProductCardSkeleton v-for="n in 5" :key="n" />
    </div>
  </div>
</template>
<style>
.loading .carousel:not(.is-vertical) .carousel__slide--clone:first-child {
    --vc-cloned-offset: -100%;
}
.carousel {
  width: 100%;
  overflow: hidden;
  overscroll-behavior: auto !important;
}

.product_slider .carousel__track,
.product_slider .carousel__slide {
  justify-content: flex-start !important;
}

@media (min-width: 430px) {
  .loading .product_slider .carousel__slide {
    width: calc(50% - 5px) !important;
  }
}
@media (min-width: 768px) {
  .loading .product_slider .carousel__slide {
    width: calc(33% - 5px) !important;
  }
}
@media (min-width: 1024px) {
  .loading .product_slider .carousel__slide {
    width: calc(20% - 5px) !important;
  }
}

.carousel__prev,
.carousel__next {
  background: hsla(0, 0%, 85%, 0.75);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5em;
  width: 2.5em;
  z-index: 1;
  font-size: 16px;
}

.product_slider .carousel__prev {
    left: 0em;
}

.product_slider .carousel__next {
    right: 0em;
}

.carousel__prev svg,
.carousel__next svg {
  fill: #000;
  height: 1.2em;
  width: 1.2em;
  padding:0;
}

.carousel__prev svg {
  transform: scaleX(-1);
}

.carousel__prev:hover,
.carousel__next:hover {
  background-color:hsla(0, 0%, 85%, 1);
  transition: background-color ease .3s;
}
</style>