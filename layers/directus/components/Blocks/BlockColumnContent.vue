<script setup lang="ts">
const props = defineProps({
    columnData: Object
})

const { styleObject } = useSectionStyles(props.columnData)
const { getBlockComponent } = useBlockRegistry()
</script>

<template>
    <div 
        class="block-column-content flex flex-col overflow-hidden self-stretch !my-0"
        :style="styleObject"
    >
        <component
            v-for="content in columnData?.blocks"
            :key="content.id"
            :is="getBlockComponent(content.collection)"
            :blockData="content.item"
            class=""
        />
    </div>
</template>