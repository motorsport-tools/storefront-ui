<script setup lang="ts">
import type { BlockLunchbox } from '../../shared/types/schema';

interface Props {
    blockData: BlockLunchbox
}

const props = defineProps<Props>()

const item1Class = computed( () => {
    if (props.blockData.layout == '2') {
        return 'col-start-1 col-span-2 rounded-lg md:rounded-none md:rounded-tl-xl'
    } else if (props.blockData.layout == '3') {
        return 'col-start-1 col-span-2 row-start-1 row-span-2 rounded-l-xl'
    } else if (props.blockData.layout == '4') {
        return 'col-start-1 rounded-tl-xl'
    } else {
        return 'col-start-1 col-span-2 rounded-lg md:row-start-1 md:row-span-2 md:rounded-none md:rounded-l-xl'
    }
})
const item2Class = computed( () => {
    if (props.blockData.layout == '2') {
        return 'col-start-1 md:col-start-3 col-span-2 row-start-2 md:row-start-1 md:row-span-2 rounded-lg md:rounded-none md:rounded-r-xl'
    } else if (props.blockData.layout == '3') {
        return 'col-start-3 row-start-1'
    } else if (props.blockData.layout == '4') {
        return 'col-start-2 row-start-1'
    } else {
        return 'col-start-1 col-span-2 row-start-2 rounded-lg md:col-start-3 md:col-span-2 md:row-start-1 md:rounded-none md:rounded-tr-xl'
    }
})
const item3Class = computed( () => {
    if (props.blockData.layout == '2') {
        return 'col-start-1 row-start-3 md:row-start-2 rounded-l-lg md:rounded-none md:rounded-bl-xl'
    } else if (props.blockData.layout == '3') {
        return 'col-start-4 row-start-1 rounded-tr-xl'
    } else if (props.blockData.layout == '4') {
        return 'col-start-3 col-span-2 row-start-1 row-span-2 rounded-r-xl'
    } else {
        return 'col-start-1 row-start-3 rounded-l-lg md:col-start-3 md:row-start-2 md:rounded-none'
    }
})
const item4Class = computed( () => {
    if (props.blockData.layout == '2') {
        return 'col-start-2 row-start-3 md:row-start-2 rounded-r-lg md:rounded-none'
    } else if (props.blockData.layout == '3') {
        return 'col-start-3 col-span-2 row-start-2 rounded-br-xl'
    } else if (props.blockData.layout == '4') {
        return 'col-start-1 col-span-2 row-start-2 rounded-bl-xl'
    } else {
        return 'col-start-2 row-start-3 rounded-r-lg md:col-start-4 md:row-start-2 md:rounded-none md:rounded-br-xl'
    }
})

</script>
<template>
    <div class="w-full h-full min-h-80 md:min-h-[46rem] relative grid grid-cols-2 md:grid-cols-4  grid-rows-3 md:grid-rows-2 gap-3">
        <div :class="item1Class" class="overflow-hidden transition-all duration-100 ease-out hover:scale-[1.02] hover:shadow-xl">
            <BlocksLunchboxContent :data="blockData?.section_content[0]?.item" block="1" :layout="blockData.layout"/>
        </div>
        <div :class="item2Class" class="overflow-hidden transition-all duration-100 ease-out hover:scale-[1.02] hover:shadow-xl">
            <BlocksLunchboxContent :data="blockData?.section_content[1]?.item" block="2" :layout="blockData.layout"/>
        </div>
        <div :class="item3Class" class="overflow-hidden transition-all duration-100 ease-out hover:scale-[1.02] hover:shadow-xl">
            <BlocksLunchboxContent :data="blockData?.section_content[2]?.item" block="3" :layout="blockData.layout"/>
        </div>
        <div :class="item4Class" class="overflow-hidden transition-all duration-100 ease-out hover:scale-[1.02] hover:shadow-xl">
            <BlocksLunchboxContent :data="blockData?.section_content[3]?.item" block="4" :layout="blockData.layout"/>
        </div>
    </div>
</template>
<style>

</style>