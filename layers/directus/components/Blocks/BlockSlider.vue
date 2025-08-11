<script setup lang="ts">
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation, type CarouselConfig } from 'vue3-carousel'
import { type BlockSlider } from '../../shared/types/schema'

interface Props {
    blockData: BlockSlider
}

const props = defineProps<Props>()

const isAutoplayActive = ref(props.blockData?.autoplay);

const sliderRef = ref()
const wrapperRef = ref()
const sliderOptions:CarouselConfig = {
    ignoreAnimations: true,
    itemsToScroll: props.blockData?.perMove || 1,
    itemsToShow: props.blockData?.perPage || 1,
    clamp: true,
    gap: 0,
    slideEffect: props.blockData?.type || "slide",
    touchDrag: true,
    transition: props.blockData?.speed || 600,
    wrapAround: props.blockData?.rewind ? false : true,
    mouseWheel: props.blockData?.wheel || false,
    pauseAutoplayOnHover: props.blockData?.pauseOnHover || false,
    enabled: true,
    height: "auto",
    i18n: {},
    snapAlign: "start",
    preventExcessiveDragging: false,
}

const sliderKey = ref(0)

watch(() => props.blockData, () => {
  sliderKey.value++
})

const onClickHandler = () => {
    isAutoplayActive.value = !isAutoplayActive.value
}

const SliderInit = async () => {
  await nextTick()
  if(wrapperRef.value) {
    wrapperRef.value.classList?.remove('loading')
  }
}
</script>
<template>
    <div ref="wrapperRef" class="loading w-full h-auto">
        <Carousel
            v-bind="sliderOptions"
            :key="sliderKey"
            ref="sliderRef"
            class="block_slider h-60 lg:h-[30rem] w-full"
            :class="['loading']"
            aria-roledescription="carousel"
            :aria-label="blockData?.ariaLabel"
            :autoplay="isAutoplayActive ? props.blockData?.autoplay_delay :0"
            @init="SliderInit"
        >
            <Slide
                v-for="(slide, slideIndex) in blockData.slider_slides"
                :key="slideIndex"
                class="text-black bg-cover bg-no-repeat bg-center w-full h-60 lg:h-[30rem]"
                aria-roledescription="slide"
            >
                <BlocksSliderSlide
                    :slide="slide"
                    :itemKey="slideIndex"
                />
            </Slide>

            <template #addons>
                <Navigation>
                <template #prev>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false"><path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path></svg>
                </template>
                <template #next>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false"><path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path></svg>
                </template>
                </Navigation>
                <CarouselPlayPauseButton
                    :isPlaying="isAutoplayActive"
                    @click="onClickHandler()"
                />
            </template>
        </Carousel>
    </div>        

 
</template>

<style>
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

.block_slider .carousel__prev {
    left: 1em;
}

.block_slider .carousel__next {
    right: 1em;
}

.carousel__track {
    transform: translateX(0px);
}

.loading .carousel:not(.is-vertical) .carousel__slide--clone:first-child {
    --vc-cloned-offset: -100%;
}

.vueperslides__progress {
    background: rgba(0, 0, 0, 0.25);
    color:var(--slider-progress-color);
    height: 3px;
}
.vueperslides__bullet {
    margin: 1em .1em;
}
.vueperslides__bullet .default {
    background: #222222;
    border: 0;
    display: inline-block;
    height: 8px;
    margin: 3px;
    padding: 0;
    position: relative;
    transition: transform .2s linear;
    width: 20px;
    border-radius: 0;
}

.vueperslides__bullet--active .default {
    background: hsla(0,0%,98%,.75);
    transform: scale(1.1);
    z-index: 1;
}

.vueperslides__bullet span {
  display: none;
  visibility: hidden;
}
</style>