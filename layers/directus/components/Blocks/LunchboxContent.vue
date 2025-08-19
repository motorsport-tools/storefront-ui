<script setup lang="ts">
import type { BlockLunchboxContent } from '../../shared/types/schema';

interface Props {
    data: BlockLunchboxContent
}

defineProps<Props>()

function getPositionClass(position: string): string {
  switch (position) {
    default:
    case 'center':
      return 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    case 'top':
      return 'absolute top-0 left-1/2 -translate-x-1/2';
    case 'bottom':
      return 'absolute bottom-0 left-1/2 -translate-x-1/2';
    case 'left':
      return 'absolute left-0 top-1/2 -translate-y-1/2';
    case 'right':
      return 'absolute right-0 top-1/2 -translate-y-1/2';
    case 'top-left':
      return 'absolute top-0 left-0';
    case 'top-right':
      return 'absolute top-0 right-0';
    case 'bottom-left':
      return 'absolute bottom-0 left-0';
    case 'bottom-right':
      return 'absolute bottom-0 right-0';
  }
}
</script>
<template>
    <NuxtLink
        class="relative w-full h-full block min-h-60"
        :style="{backgroundColor: data?.background_color}"
        :to="`${data?.link_to}`"
        :title="`${data?.link_title}`"
    >
        <NuxtImg
            class="w-full h-full object-cover absolute z-0"
            loading="lazy"
            provider="directus"
            :src="`/assets/${data?.background_image?.id}`"
            sizes="50vw sm:640px"
            format="webp"
            quality="75"
            :alt="data?.background_image?.title || `Image background for ${data?.link_title}`"
        />
        <div class="inline-block absolute p-2 z-1 text-white font-bold text-2xl sm:text-3xl md:text-4xl drop-shadow-md" v-html="data?.content" :class="getPositionClass(data?.text_position || 'bottom-left')">
        </div>
    </NuxtLink>
</template>
<style>

</style>