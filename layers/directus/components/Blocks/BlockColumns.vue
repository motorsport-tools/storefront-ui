<script setup lang="ts">
import type { BlockColumn } from '../../shared/types/schema';
interface Props {
    blockData: BlockColumn
}

const props = defineProps<Props>()

</script>
<template>
    <div class="block-columns flex flex-col md:flex-row w-full gap-4 items-stretch">
        <template v-for="item in blockData?.columns" :key="typeof item === 'string' ? item : item.id">
            <BlocksBlockColumnContent 
                v-if="typeof item !== 'string' && typeof item.item === 'object' && item.item !== null"
                :columnData="item.item"
                :class="item?.item.width"
            />
        </template>
    </div>
</template>