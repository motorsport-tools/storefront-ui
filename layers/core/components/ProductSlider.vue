<script setup lang="ts">
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

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
const slideOptions: Options = computed(() => ({
    type: 'loop',
    rewind: true,
    lazyLoad: 'nearby',
    autoplay: false,
    speed: 400,
    rewindSpeed: 400,
    pagination: false,
    arrows: true,
    wheel: false,
    keyboard: true,
    pauseOnHover: true,
    pauseOnFocus: true,
    start: 0,
    perPage: 1,
    perMove: 1,
    snap: true,
    mediaQuery: 'min',
    breakpoints: {
      0: {
        perPage:1,
      },
      430: {
        perPage: 2,
      },
      640: {
        perPage: 2,
      },
      768: {
        perPage: 3,
      },
      1024: {
        perPage: 5,
      }
    }

}))

const options = {
  arrows: true,
  arrowsOutside: false,
  draggingDistance: 70,
  parallax: false,
  lazy: true,
  autoPlaying: false,
  internalAutoPlaying: false,
  fractions: false,
  gap: 10,
  slideRatio: null,
  visibleSlides: 1,
  bullets: false,
  breakpoints: {
    430: {
      visibleSlides: 1,
    },
    768: {
      visibleSlides: 2,
    },
    1024: {
      visibleSlides: 3,
    },
    99999: {
      visibleSlides: 5,
    }
  }
}


const { loading } = useProductTemplateList(`product-slider--block-${props.blockId}`)

console.log(loading.value)

watch(loading, (val) => {
  console.log('Loading Changed: ', val)
})
</script>

<template>
    <h2
      v-if="heading"
      class="text-center mb-6 font-bold typography-headline-3 md:typography-headline-2 block"
    >
      {{ heading }}
    </h2>
    <VueperSlides
      ref="sliderRef"
      v-bind="options"
      class="no-shadow w-full product-slider"
    >
      <template #arrow-right>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false"><path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path></svg>
      </template>
      <template #arrow-left>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false"><path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path></svg>
      </template>
      <VueperSlide
        v-for="(productTemplate, index) in productTemplateList"
        :key="index"
      >
        <template #content>
          <UiProductCard
            v-if="!loading"
            :key="productTemplate?.id || index"
            :slug=" mountUrlSlugForProductVariant(productTemplate.firstVariant as Product) || '' "
            :name="productTemplate?.name || ''"
            :image-url="
              $getImage(
                String(productTemplate.image),
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
          >
          </UiProductCard>
          <UiProductCardSkeleton
            v-else
          />
        </template>
      </VueperSlide>
    </VueperSlides>
</template>
<style>
.product-slider .vueperslides__track {
  height: auto !important;
  position: relative !important;
}

.product-slider .vueperslides__arrow {
  align-items: center;
  background: hsla(0, 0%, 85%, 0.75);
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  height: 2.5em;
  justify-content: center;
  padding: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5em;
  z-index: 1;
  transition: background-color ease .3s;
}
.product-slider .vueperslides__arrow svg {
  fill: #000;
  height: 1.2em;
  width: 1.2em;
  padding:0;
}
.product-slider .vueperslides__arrow--prev svg {
  transform: scaleX(-1);
}
.product-slider .vueperslides__arrow:hover {
  background-color:hsla(0, 0%, 85%, 1);
}
.product-slider .vueperslides__arrow--prev {
  left: -1rem;
}
.product-slider .vueperslides__arrow--next {
  right: -1rem;
}

/** No JS */
.product-slider.vueperslides--no-animation {

}
.product-slider.vueperslides--no-animation .vueperslides__track-inner {
  overflow-x: hidden;
}
.product-slider.vueperslides--no-animation .vueperslide {
  width: auto;
}
</style>