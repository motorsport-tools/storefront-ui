<script setup lang="ts">
// @ts-ignore
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'
import { type BlockSlider } from '../../shared/types/schema'

import { SfIconBase } from '@storefront-ui/vue'

interface Props {
    blockData: BlockSlider
}

const props = defineProps<Props>()

console.log(props.blockData);

const sliderRef = ref()

const options = {
    arrows: true,
    draggingDistance: 70,
    infinite: props.blockData?.rewind ? false : true,
    lazy: props.blockData?.lazyLoad || false,
    autoplay: props.blockData?.autoplay || false,
    progress: props.blockData?.ShowProgress || true,
    pauseOnHover: props.blockData?.pauseOnHover || false,
    pauseOnTouch: props.blockData?.pauseOnHover || false,
    initSlide: props.blockData?.start || 1,
    transitionSpeed: props.blockData?.speed || 600,
    visibleSlides: props.blockData?.perPage || 1,
    slideMultiple: props.blockData?.perMove > 1 ? true : false,
    gap: 0,
    slideRatio: null,
    bullets: true,
}

console.log('Slider Options: ',options)

const sliderKey = ref(0)

watch(() => props.blockData, () => {
  sliderKey.value++
})
</script>
<template>
        <VueperSlides
            v-bind="options"
            :key="sliderKey"
            ref="sliderRef"
            class="no-shadow h-60 lg:h-[30rem] w-full"
            aria-roledescription="carousel"
            :aria-label="blockData?.ariaLabel"
            :style="{'--slider-progress-color': blockData?.ProgressColor || '#0097d6'}"
        >
            <template #arrow-right>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false"><path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path></svg>
            </template>
            <template #arrow-left>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false"><path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path></svg>
            </template>
            <VueperSlide
                v-for="(slide, slideIndex) in blockData.slider_slides"
                :key="slideIndex"
                class="text-black bg-cover bg-no-repeat bg-center w-full h-60 lg:h-[30rem]"
                aria-roledescription="slide"
            >
                <template #content>
                    <BlocksSliderSlide
                        :slide="slide"
                        :itemKey="slideIndex"
                    />
                </template>
            </VueperSlide>
        </VueperSlides>
            
            <button
                class="splide__toggle 
                border-transparent
                hover:background-neutral-200"
                title="Play/Pause Autoplay"
            >   
                
                <SfIconBase
                    class="splide__toggle__play w-7 h-7 fill-white text-white!"
                    viewBox="0 0 26 26"
                >
                    <path fill="#fff" d="M20.208 11.857L6.902 5.26a1.31 1.31 0 0 0-1.268.052a1.27 1.27 0 0 0-.619 1.09V19.6c0 .443.233.856.619 1.089a1.32 1.32 0 0 0 1.269.052l13.306-6.599c.438-.218.716-.658.716-1.143s-.279-.924-.717-1.142"/>

                </SfIconBase>
                <SfIconBase
                    class="splide__toggle__pause w-7 h-7 fill-white text-white!"
                    viewBox="0 0 12 12"
                >
                    <path fill="none" stroke="#fff" stroke-linecap="round" stroke-width="2" d="M4 2v8m4-8v8"/>
                </SfIconBase>
            </button>

 
</template>

<style>
.vueperslides__progress {
    background: rgba(0, 0, 0, 0.25);
    color:var(--slider-progress-color);
    height: 3px;
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

.vueperslides__track {
  position: relative !important;
}

.vueperslides__arrow {
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
.vueperslides__arrow svg {
  fill: #000;
  height: 1.2em;
  width: 1.2em;
  padding:0;
}
.vueperslides__arrow--prev svg {
  transform: scaleX(-1);
}
.vueperslides__arrow:hover {
  background-color:hsla(0, 0%, 85%, 1);
}
.vueperslides__arrow--prev {
  left: 1rem;
}
.vueperslides__arrow--next {
  right: 1rem;
}

.splide__toggle {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 50;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.splide__pagination {
    z-index: 50;
}
.splide__progress {
    height: 3px;
    background: transparent;
}
.splide__progress__bar {
    height: 3px;
    transform: translateZ(0);
    will-change: width;
    background:var(--slider-progress-color);
}
.splide__arrow {
    align-items: center;
    background: hsla(0,0%,98%,.75);
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
.splide__arrow:hover {
    background-color:#f9f9f9;
}
.splide__arrow--next {
    right: 1em;
}
.splide__arrow--prev {
    left: 1em;
}
.splide__arrow--prev svg {
    transform: scaleX(-1);
}
.splide__arrow svg {
    fill: #000;
    height: 1.2em;
    width: 1.2em;
}

.splide__pagination {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0;
    pointer-events: none;
    bottom: .5em;
    left: 0;
    padding: 0 1em;
    position: absolute;
    right: 0;
    z-index: 1;
}

.splide__pagination li {
    display: block;
    line-height: 1;
    list-style-type: none;
    margin: 0;
    pointer-events: auto;
}

.splide__pagination__page {
    background: #222222;
    border: 0;
    display: inline-block;
    height: 8px;
    margin: 3px;
    padding: 0;
    position: relative;
    transition: transform .2s linear;
    width: 20px;
}
.splide__pagination__page.is-active {
    background: hsla(0,0%,98%,.75);
    transform: scale(1.1);
    z-index: 1;
}
</style>