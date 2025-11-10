<script setup lang="ts">
interface Props { 
    loading: boolean,
}
const props = defineProps<Props>()
</script>
<template>
    <section
        v-if="!loading"
        class="lg:mx-4 mb-20"
    >
        <ClientOnly>
            <LazyProductRecentViewSlider
                heading="Your recent views"
            />
        </ClientOnly>
    </section>
</template>