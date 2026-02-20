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
    borderWidth: props.sectionData?.border_width+`px`,
    borderColor: props.sectionData?.border_color,
    borderRadius: props.sectionData?.border_radius+`px`,
    ...(props.sectionData.full_width? {} : { marginTop: '2rem', marginBottom: '2rem'}),
    ...(backgroundImage.value ? { backgroundImage: `url('${backgroundImage.value}')` } : {})
        
}))

</script>
<template>
    <section 
        :class="sectionData?.full_width ? 'w-full' : 'narrow-container'"
    >
        <div 
            class="flex flex-col px-4 lg:px-0"
            :style="styleObject"
        >
            <component
                class="py-4"
                v-for="block in sectionData?.blocks"
                :key="block.id"
                :is="getBlockComponent(block.collection)"
                :blockData="block.item"
            />
        </div>
    </section>
</template>