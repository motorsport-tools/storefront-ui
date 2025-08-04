<script setup lang="ts">
const props = defineProps({
    sectionData: Object
})

const { $viewport } = useNuxtApp()

const { getBlockComponent } = useBlockRegistry()

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
    ...(props.sectionData.full_width? {} : { paddingTop: '2rem', paddingBottom: '2rem'}),
    ...(backgroundImage.value ? { backgroundImage: `url('${backgroundImage.value}')` } : {})
        
}))

</script>
<template>
    <section 
        class="flex flex-col"
        :class="sectionData?.full_width ? 'w-full' : 'narrow-container'"
        :style="styleObject"
    >
        <component
            v-for="block in sectionData?.blocks"
            :key="block.id"
            :is="getBlockComponent(block.collection)"
            :blockData="block.item"
        />
    </section>
</template>