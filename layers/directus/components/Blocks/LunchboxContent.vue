<script setup lang="ts">
import type { BlockLunchboxContent } from '../../shared/types/schema';

interface Props {
    data: BlockLunchboxContent
    block: string
    layout: number
}
const props = defineProps<Props>()

const dims = computed(() => {
  let width = "0"
  let height = "0"
  if( props.layout === 1 ) {
    switch (props.block) {
      case "1":
        width = "662px"
        height = "736px"
        break
      case "2":
        width = "662px"
        height = "368px"
        break
      case "3":
        width = "331px"
        height = "368px"
        break
      case "4":
        width = "331px"
        height = "368px"
        break
    }
  } else if( props.layout === 2 ) {
    switch (props.block) {
      case "1":
        width = "662px"
        height = "368px"
        break
      case "2":
        width = "662px"
        height = "736px"
        break
      case "3":
        width = "331px"
        height = "368px"
        break
      case "4":
        width = "331px"
        height = "368px"
        break
    }
  } else if( props.layout === 3 ) {
    switch (props.block) {
      case "1":
        width = "496px"
        height = "736px"
        break
      case "2":
        width = "331px"
        height = "368px"
        break
      case "3":
        width = "331px"
        height = "368px"
        break
      case "4":
        width = "662px"
        height = "368px"
        break
    }
  } else if( props.layout === 4 ) {
    switch (props.block) {
      case "1":
        width = "331px"
        height = "736px"
        break
      case "2":
        width = "331px"
        height = "368px"
        break
      case "3":
        width = "662px"
        height = "736px"
        break
      case "4":
        width = "662px"
        height = "368px"
        break
    }
  } 
  return { width: width, height: height }
})

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
            sizes="xs:376px sm:640px md:768px lg:662px xl:662px xxl:662px 2xl:662px"
            format="webp"
            quality="75"
            :alt="data?.background_image?.title || `Image background for ${data?.link_title}`"
            :width="dims.width"
            :height="dims.height"
        />
        <div class="inline-block absolute p-2 z-1 text-white font-bold text-2xl sm:text-3xl md:text-4xl drop-shadow-md" v-html="data?.content" :class="getPositionClass(data?.text_position || 'bottom-left')">
        </div>
    </NuxtLink>
</template>
<style>

</style>