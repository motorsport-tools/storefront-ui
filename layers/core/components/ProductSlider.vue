<script setup lang="ts">
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'

import type { CustomProductWithStockFromRedis, Product } from '~/graphql'

const props = defineProps({
  heading: String,
  productTemplateList: {
    type: Array<Product>,
    default: () => [],
  },
  blockId: Number,
})
const { getRegularPrice, getSpecialPrice } = useProductAttributes()

const sliderRef = ref()
const wrapperRef = ref()
const sliderOptions = {
  ignoreAnimations: true,
  itemsToScroll: 1,
  clamp: true,
  gap: 10,
  slideEffect: 'slide',
  touchDrag: true,
  transition: 300,
  wrapAround: true,
  breakpoints: {
    0: {
      itemsToShow: 1,
      snapAlign: 'center',
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
}

const { loading } = useProductTemplateList(`product-slider--block-${props.blockId}`)

const SliderInit = async () => {
  await nextTick()
  if(wrapperRef.value) {
    wrapperRef.value.classList?.remove('loading')
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
    <div ref="wrapperRef" class="loading w-full h-auto">
      <Carousel
        v-bind="sliderOptions"
        ref="sliderRef"
        class="product_slider"
        aria-roledescription="carousel"
        @init="SliderInit"
      >
        <Slide
          v-for="(productTemplate, index) in productTemplateList"
          :key="index"
          aria-roledescription="slide"
        >
          <LazyUiProductCard
              v-if="!loading"
              :key="productTemplate?.id || index"
              :slug=" mountUrlSlugForProductVariant(productTemplate.firstVariant as Product || productTemplate as Product) || '' "
              :name="productTemplate?.name || ''"
              :image-url="
                $getImage(
                  `${String(productTemplate.image)}`,
                  370,
                  370,
                  String(productTemplate.imageFilename),
                )
              "
              :brand="productTemplate?.brand"
              :image-alt="productTemplate?.name || ''"
              :regular-price="getRegularPrice(productTemplate.firstVariant as Product)"
              :special-price="getSpecialPrice(productTemplate.firstVariant as Product)"
              :is-in-wishlist="productTemplate?.isInWishlist || false"
              :rating-count="productTemplate.ratingCount || 0"
              :rating="productTemplate.rating || 0"
              :first-variant="productTemplate.firstVariant as CustomProductWithStockFromRedis"
            />
            <UiProductCardSkeleton
              v-else
            />
        </Slide>

        <template #addons>
          <Navigation
            v-if="productTemplateList.length > sliderRef?.data?.config?.itemsToShow"
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