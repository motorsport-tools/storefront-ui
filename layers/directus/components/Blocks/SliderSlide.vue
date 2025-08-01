<script setup lang="ts">
import { SplideSlide } from '@splidejs/vue-splide'
import type { BlockSliderSlide } from '../../shared/types/schema';
import { useResponsiveBg } from '../../composables/useResponsiveBg';

interface Props {
    slide: BlockSliderSlide
    itemKey: number
}

const props = defineProps<Props>()

const { width: imageWidth } = useResponsiveBg(props.slide?.background_image.id || '')


</script>
<template>
    <SplideSlide
        :key="slide.id"
        class="text-black bg-cover bg-no-repeat bg-center w-full h-full"
        role=""
    >   
        <NuxtImg
            class="w-full h-full object-cover absolute z-0"
            :loading="itemKey >= 1? 'lazy': 'eager'"
            :fetchpriority="itemKey == 0? 'high': 'auto'"
            :src="`/assets/${slide?.background_image.id}`"
            :width="imageWidth"
            format="webp"
            quality="75"
            provider="directus"
            :alt="slide?.background_image.title? slide?.background_image.title : `Promotional image slide ${itemKey}`"
        />
    </SplideSlide>
</template>