<script setup lang="ts">
import type { BlockSliderSlide } from '../../shared/types/schema';
import { useResponsiveBg } from '../../composables/useResponsiveBg';

interface Props {
    slide: BlockSliderSlide
    itemKey: number
}

const props = defineProps<Props>()

</script>
<template>

    <NuxtImg
        class="w-full h-full object-cover absolute z-0"
        :loading="itemKey >= 1? 'lazy': 'eager'"
        :fetchpriority="itemKey == 0? 'high': 'auto'"
        :src="`/assets/${slide?.background_image?.id}`"
        sizes="100vw sm:1024px lg:1280px xl:1536px"
        format="webp"
        quality="75"
        provider="directus"
        :alt="slide?.background_image.title? slide?.background_image.title : `Promotional image slide ${itemKey}`"
    />

</template>