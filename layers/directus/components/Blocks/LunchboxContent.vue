<script setup lang="ts">
import type { BlockLunchboxContent } from '../../shared/types/schema';

interface Props {
    data: BlockLunchboxContent
}

defineProps<Props>()
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
            :src="`/assets/${data?.background_image}`"
            sizes="50vw sm:640px"
        />
        <div class="inline-block absolute p-2 z-1 text-white font-bold text-4xl drop-shadow-md" v-html="data?.content">
        </div>
    </NuxtLink>
</template>
<style>

</style>