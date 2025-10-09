<script setup lang="ts">
const { $viewport } = useNuxtApp()

interface Props {
    blockData: Object
}

const props = defineProps<Props>()
const numCols = computed(() => {
    if($viewport.isGreaterOrEquals('md')) return props.blockData?.columns
    if($viewport.isGreaterOrEquals('sm')) return 4
    return 1
})

const { getBlockComponent } = useBlockRegistry()
onMounted(() => {
    numCols.value = props.blockData?.columns || 0
})

</script>
<template>
    <div
        class="grid lg:justify-items-center grid-cols-[1fr_1fr] gap-10 w-full"
        :style="{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }"
    >
        <div
            v-for="block in blockData?.items"
            class="flex items-center justify-center"
        >
            <component
                :key="block.id"
                :is="getBlockComponent(block.collection)"
                :blockData="block.item"
            />
        </div>
    </div>
</template>