<script setup lang="ts">
const props = defineProps<{
    label?: string;
}>();
</script>
<template>
    <div 
        class="flex flex-row py-2 px-4 mt-0 mb-2 bg-neutral-100 md:rounded-md items-center justify-between">
        <slot name="prefix"></slot>
        <h5
            class="typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest"
        >
            <slot></slot>
        </h5>
        <slot name="affix"></slot>
    </div>
</template>