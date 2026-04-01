<script setup lang="ts">
const props = defineProps({
    sectionData: Object
})

const { getBlockComponent } = useBlockRegistry()
const { styleObject } = useSectionStyles(props.sectionData)

</script>
<template>
    <section 
        :class="sectionData?.full_width ? 'w-full' : 'narrow-container'"
    >
        <div 
            class="page-builder-section flex flex-col px-4 lg:px-0 overflow-hidden"
            :style="styleObject"
        >
            <component
                v-for="block in sectionData?.blocks"
                :key="block.id"
                :class="[
                    block.collection,                  
                    !sectionData?.full_width ? 'py-4' : ''  
                ]"
                :is="getBlockComponent(block.collection)"
                :blockData="block.item"
            />
        </div>
    </section>
</template>