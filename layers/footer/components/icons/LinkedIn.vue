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
        name="ant-design:linkedin-filled" 
        :size="size" 
        class="inline-block fill-current w-5 h-5"
        v-bind:loading="loading"
    />
</template>