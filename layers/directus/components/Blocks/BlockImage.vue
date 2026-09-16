<script setup lang="ts">
import type { BlockImage } from '../../shared/types/schema';
interface Props {
    blockData: BlockImage
}

const props = defineProps<Props>()
</script>
<template>
    <NuxtLink
        v-if="blockData?.link"
        :title="blockData?.alt"
        :to="blockData?.link"
        :target="blockData?.link_target"
        :class="blockData?.class"
    >
        <NuxtImg
            :loading="blockData?.lazy_loading ? 'lazy' : 'eager'"
            :alt="blockData?.alt"
            provider="directus"
            :src="blockData?.image?.filename_disk"
            :width="blockData?.image?.width || 800"
            :height="blockData?.image?.height || 600"
            format="webp"
            quality="75"
            densities="1"
        />
    </NuxtLink>

    <NuxtImg
        v-else
        :class="blockData?.class"
        :loading="blockData?.lazy_loading ? 'lazy' : 'eager'"
        :alt="blockData?.alt"
        provider="directus"
        :src="blockData?.image?.filename_disk"
        format="webp"
        quality="75"
        :width="blockData?.image?.width || 800"
        :height="blockData?.image?.height || 600"
        densities="1"
        class="h-full w-full object-cover"
        />
</template>