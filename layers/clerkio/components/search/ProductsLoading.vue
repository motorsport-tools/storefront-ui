<script setup lang="ts">
const hitsPerPage = inject('hitsPerPage')
</script>
<template>
    <section 
        class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8"
    >
        <UiProductCardSkeleton v-for="i in Number(hitsPerPage)" :key="i" />
    </section>
</template>