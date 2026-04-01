<script setup lang="ts">
interface Props {
    blockData: Object
}

const props = defineProps<Props>()
</script>
<template>
    <div 
        class="w-full h-auto px-4"
        v-html="blockData?.content"
    >
    </div>
</template>
