<script setup lang="ts">
import { SplideSlide } from '@splidejs/vue-splide'
import type { BlockSliderSlide } from '../../shared/types/schema';
import { useResponsiveBg } from '../../composables/useResponsiveBg';

interface Props {
    slide: BlockSliderSlide
    itemKey: Number
}

const props = defineProps<Props>()

const { bgStyle: backgroundStyles, url: imageUrl } = useResponsiveBg(props.slide?.background_image || '')

if(props.itemKey == 0) {
    useHead({
        link: [{
            rel: 'preload',
            as: 'image',
            href: imageUrl
        }]
    })
}

</script>
<template>
    <SplideSlide
        :key="slide.id"
        class="text-black bg-cover bg-no-repeat bg-center w-full h-full"
        :style="backgroundStyles"
    >   
        <!--
        <NuxtImg
            provider="directus"
            :src="`/assets/${slide.background_image}`"
            sizes="100vw sm:100vw md:100vw lg:100vw"
            format="webp"
            quality="70"
            alt="Directus image"
        />
        -->
    </SplideSlide>
</template>