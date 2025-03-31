<script setup lang="ts">
import { Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import { SfButton, SfIconBase } from '@storefront-ui/vue';


const { $directus, $readItems, $directusImage } = useNuxtApp()

const { data: slides } = await useAsyncData('slides', () => {
    return $directus.request($readItems('home_slides', { 
        limit: 5,
        filter: {
            status: {
                _eq: 'published',
            },
        }, 
    }))
})
</script>

<template>
    <section class="slide-wrapper"  v-if="slides">
        <Splide
            class="h-60 lg:h-[30rem]"
            :has-track="false" 
            :options="{ rewing: true,type: 'loop', lazyLoad: true, autoplay: true, interval: 8000, wheel: true, pauseOnFocus: true, pauseOnHover: true }" aria-label="Promotional Slider"
        >
            <div class="splide__progress ">
                <div class="splide__progress__bar">
                </div>
            </div>
            <SplideTrack
                class="h-80 lg:h-[40rem] overflow-y-hidden"
            >
                <SplideSlide
                    v-for="slide in slides"
                    :key="slide.id"
                    class="h-80 lg:h-[40rem] text-black bg-cover bg-no-repeat bg-center p-6"
                    :style="{ backgroundImage: `url(${$directusImage(slide.backgroundImage)})` }"
                >
                    <h2>{{ slide.title }}</h2>
                </SplideSlide>
            </SplideTrack>
            
            <button
                class="splide__toggle 
                border
                border-transparent
                hover:border-neutral-900
                hover:background-neutral-200 
                text-neutral-900!"
                variant="tertiary"
                title="Play/Pause Autoplay"
            >   
                
                <SfIconBase
                    class="splide__toggle__play w-9 h-9 fill-neutral-900 text-neutral-900!"
                    viewBox="0 0 16 16"
                >
                    <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/>

                </SfIconBase>
                <SfIconBase
                    class="splide__toggle__pause w-9 h-9 fill-neutral-900 text-neutral-900!"
                    viewBox="0 0 16 16"
                >
                    <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/>
                </SfIconBase>
            </button>
            
        </Splide>
        
    </section>
    <section v-else></section>
</template>

<style>
.splide__track {
    position: relative;
}
.splide__track::before {
    content:"";
    position: absolute;
    bottom: 0;
    display:block;
    width:  100%;
    top: 78%;
    z-index: +1;
    background: linear-gradient(-180deg, rgba(234, 237, 237, 0), #E3E6E6);
}
.splide__toggle {
    position: absolute;
    bottom:10px;
    right: 10px;
    z-index:50;
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
    background: #CD1619;
}
</style>