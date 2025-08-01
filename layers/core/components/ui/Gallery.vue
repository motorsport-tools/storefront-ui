<script lang="ts" setup>
import { SfScrollable } from '@storefront-ui/vue'
import { ref, computed, type PropType } from 'vue'
import type { ImageGalleryItem } from '~/graphql'

const props = defineProps({
  mainImage: {
    type: Object as PropType<ImageGalleryItem>,
    required: true,
  },
  thumbs: {
    type: Array as PropType<ImageGalleryItem[]>,
    default: () => [],
  },
})

const thumbsRef = ref<HTMLElement>()
const activeIndex = ref(0)

const allImages = computed(() => [
  {
    imageSrc: props.mainImage.url,
    imageThumbSrc: props.mainImage.url,
    alt: props.mainImage.alt,
  },
  ...props.thumbs.map(thumb => ({
    imageSrc: thumb.url,
    imageThumbSrc: thumb.url,
    alt: thumb.alt,
  })),
])
</script>

<template>
  <div class="relative flex w-full max-h-[600px] aspect-[4/3]">
    <SfScrollable
      ref="thumbsRef"
      class="items-center w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      direction="vertical"
      :active-index="activeIndex"
      buttons-placement="none"
    >
      <button
        v-for="({ imageThumbSrc, alt }, index) in allImages"
        :key="`${alt}-${index}-thumbnail`"
        type="button"
        :aria-label="alt"
        :aria-current="activeIndex === index"
        class="md:w-[78px] md:h-auto relative shrink-0 pb-1 mx-4 border-b-4 snap-start cursor-pointer focus-visible:outline focus-visible:outline-offset transition-colors flex-grow md:flex-grow-0"
        :class="activeIndex === index ? 'border-primary-700' : 'border-transparent'"
        @click="activeIndex = index"
      >
        <NuxtImg
          provider="odooProvider"
          :alt="alt"
          class="object-cover"
          width="78"
          height="78"
          :src="imageThumbSrc"
        />
      </button>
    </SfScrollable>
    <SfScrollable
      class="w-full h-full snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      :active-index="activeIndex"
      direction="vertical"
      wrapper-class="h-full m-auto"
      is-active-index-centered
      buttons-placement="none"
      :drag="{ containerWidth: true }"
    >
      <div
        v-for="({ imageSrc, alt }, index) in allImages"
        :key="`${alt}-${index}`"
        class="flex justify-center h-full basis-full shrink-0 grow snap-center"
      >
        <NuxtImg
          provider="odooProvider"
          :width="380"
          :height="505"
          :aria-label="alt"
          :aria-hidden="activeIndex !== index"
          class="object-cover w-auto h-full"
          :alt="alt"
          :src="imageSrc"
        />
      </div>
    </SfScrollable>
  </div>
</template>