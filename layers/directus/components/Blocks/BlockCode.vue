<script setup lang="ts">
interface Props {
    blockData: Object
}

const props = defineProps<Props>()
</script>
<template>
    <div 
        class="block-code w-full h-auto"
        v-html="blockData?.content"
    ></div>
</template>
