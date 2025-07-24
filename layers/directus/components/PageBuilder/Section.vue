<script setup lang="ts">
const props = defineProps({
    sectionData: Object
})
</script>
<template>
    <section 
        class="py-5 flex"
        :class="sectionData.full_width ? 'w-full' : 'narrow-container'"
        :style="{ 
            color: sectionData.color,
            backgroundColor: sectionData.background_color,
            alignItems: sectionData.align_items,
            justifyContent: sectionData.justify_content
        }"
    >
        {{ sectionData }}
    </section>
</template>