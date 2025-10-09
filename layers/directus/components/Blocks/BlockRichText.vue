<script setup lang="ts">
interface Props {
    blockData: Object
}

const props = defineProps<Props>()
</script>
<template>
    <div 
        class="w-full"
        :v-html="blockData?.content"
    >
    </div>
</template>
