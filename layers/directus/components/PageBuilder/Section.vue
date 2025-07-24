<script setup lang="ts">
const props = defineProps({
    sectionData: Object
})

const { $viewport } = useNuxtApp()

const backgroundImage = computed(() => {
  if ($viewport.isLessThan('lg') && props.sectionData?.backgroundSmall) {
    return props.sectionData?.backgroundSmall || ''
  }
  return props.sectionData?.background || ''
})

const styleObject = computed(() => ({
    color: props.sectionData?.color,
    backgroundColor: props.sectionData?.background_color,
    backgroundSize: props.sectionData?.background_size,
    alignItems: props.sectionData?.align_items,
    justifyContent: props.sectionData?.justify_content,
    ...(backgroundImage.value ? { backgroundImage: `url('${backgroundImage.value}')` } : {})
        
}))

</script>
<template>
    <section 
        class="py-5 flex"
        :class="sectionData.full_width ? 'w-full' : 'narrow-container'"
        :style="styleObject"
    >
        {{ sectionData }}
    </section>
</template>