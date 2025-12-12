<script setup lang="ts">
import type { BlockSliderSlide } from '../../shared/types/schema';
import { useResponsiveBg } from '../../composables/useResponsiveBg';

interface Props {
    slide: BlockSliderSlide
    itemKey: number
}

const props = defineProps<Props>()

const { getBlockComponent } = useBlockRegistry()

</script>
<template>
    <div class="w-full h-full relative h-60 lg:h-[30rem]">
        
        <NuxtImg
            v-if="slide?.background_image"
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
        <div class="relative z-1 p-6">
            <component
                v-if="slide?.block_content"
                v-for="block in slide?.block_content"
                :key="block.id"
                :is="getBlockComponent(block.collection)"
                :blockData="block.item"
            />
        </div>


    </div>

</template>

<style lang="css" scoped>
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
        font-weight: 700;
        color: #fff;
    }
    :deep(h2) {
        font-size: 28px;
        font-weight: normal;
    }
    :deep(h3) {
        font-size: 34px;
    }
    :deep(h4) {
        font-size: 20px;
    }
    :deep(h5) {
        font-size: 18px;
    }
    :deep(h6) {
        font-size: 16px;
    }
</style>