<script setup lang="ts">
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'

import type { Product } from '~/graphql'

const props = defineProps({
  heading: String,
  productTemplateList: {
    type: Array<Product>,
    default: () => [],
  },
  blockId: Number,
})
const { Pid } = useAuth()
const { getRegularPrice, getSpecialPrice } = useProductAttributes()

const sliderRef = ref()
const wrapperRef = ref()
const isShortList = computed(() => props.productTemplateList.length <= 4)
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
}

const { loading } = useRecentViews()

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
        :class="{ 'product_slider--short': isShortList }"
        :items-to-show="isShortList ? 'auto' : undefined"
        :snap-align="isShortList ? 'start' : undefined"
        :wrap-around="!isShortList"
        aria-roledescription="carousel"
        @init="SliderInit"
      >
        <Slide
          v-for="(product, index) in productTemplateList"
          :key="index"
          aria-roledescription="slide"
        >
            <LazyUiProductCard
                v-if="!loading"
                :key="product?.id || index"
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
                :first-variant="product as unknown as Product"
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

/* Keep small result sets left-aligned and card-sized instead of stretching. */
.product_slider--short .carousel__track {
  justify-content: flex-start;
}

.product_slider--short .carousel__slide {
  flex: 0 0 auto;
  width: min(270px, calc(100% - 0.5rem)) !important;
}
</style>
