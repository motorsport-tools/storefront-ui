<script setup lang="ts">
// @ts-ignore
import { Splide, SplideSlide, SplideTrack, type Options } from '@splidejs/vue-splide'
import { SfLoaderCircular } from '@storefront-ui/vue'
import { type BlockSlider } from '../../shared/types/schema'
//import '@splidejs/vue-splide/css'
import '@splidejs/vue-splide/css/core'
import { SfIconBase } from '@storefront-ui/vue'

interface Props {
    blockData: BlockSlider
}

const props = defineProps<Props>()

const sliderRef = ref()
const slideOptions: Options = computed(() => ({
    type: props.blockData?.type || 'loop',
    rewind: props.blockData?.rewind,
    lazyLoad: props.blockData?.lazyLoad,
    autoplay: props.blockData?.autoplay,
    speed: props.blockData?.speed || 400,
    rewindSpeed: props.blockData?.rewindSpeed || 400,
    wheel: props.blockData?.wheel,
    keyboard: props.blockData?.keyboard,
    pauseOnHover: props.blockData?.pauseOnHover,
    pauseOnFocus: props.blockData?.pauseOnFocus,
    start: props.blockData?.start || 0,
    perPage: props.blockData?.perPage || 1,
    perMove: props.blockData?.perMove || 1,
}))

const hydrated = ref(false)

const slides = [
    {
        id: 0,
        title: 'Slide 1',
    },
    {
        id: 1,
        title: 'Slide 2',
    }
]

const progressBar = () => {
    return h('div', { class: 'splide__progress' }, [
        h('div', { class: 'splide__progress__bar' })
    ])
}

const { $viewport } = useNuxtApp() 

const loaderSize = computed(() => {
  if ($viewport.isLessThan('md')) return 'base'
  if ($viewport.isLessThan('lg')) return 'xl'
  return 'lg'
})

const sliderKey = ref(0)

onMounted(async () => {
    await nextTick()
    requestIdleCallback(() => {
        hydrated.value = true
    })
})

watch(() => props.blockData, () => {
  sliderKey.value++
})

watch(sliderRef, (newVal) => {
    if(newVal) {
        if(!slideOptions.value.autoplay) return
        sliderRef.value.splide.Components.Autoplay.play()
    }
})
</script>
<template>
        <div v-if="!hydrated" class="h-60 lg:h-[30rem] w-full flex items-center justify-center">
            <SfLoaderCircular :size="loaderSize" />
        </div>
        <Splide
            v-else
            :key="sliderKey"
            class="h-60 lg:h-[30rem] w-full mb-[3px]"
            :has-track="false" 
            :options="slideOptions"
            :aria-label="blockData?.ariaLabel"
            ref="sliderRef"
            :style="{'--slider-progress-color': blockData?.ProgressColor || '#0097d6'}"
        >
            <template v-if="blockData?.ShowProgress && blockData?.ProgressLocation === 'top'">
                <component :is="progressBar" />
            </template>
            <SplideTrack
                class="overflow-y-hidden w-full h-full"
            >
                <SplideSlide
                    v-for="slide in slides"
                    :key="slide.id"
                    class="text-black bg-cover bg-no-repeat bg-center p-6 w-full h-full"
                >
                    <h2>{{ slide?.title || `Title!` }}</h2>
                </SplideSlide>
            </SplideTrack>

            <template v-if="blockData?.ShowProgress && blockData?.ProgressLocation === 'bottom'">
                <component :is="progressBar" />
            </template>

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

        </Splide>
</template>

<style>
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