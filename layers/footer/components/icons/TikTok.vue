<script setup lang="ts">
interface Props {
  size?: string;
  loading?: 'lazy' | 'eager';
}

const props = defineProps<Props>()
const { size = '20px', loading = 'lazy' } = props;
</script>
<template>

    <icon 
        name="cib:tiktok"  
        :size="size" 
        v-bind:loading="loading" 
        class="inline-block fill-current w-5 h-5"
    />
</template>