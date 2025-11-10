<script setup lang="ts">
interface Props {
    alt: any 
    loading: boolean,
}
const props = defineProps<Props>()
</script>
<template>
    <section
        v-if="!loading && alt"
        class="lg:mx-4 mt-28"
    >
        <LazyProductSlider
            heading="Alternative product"
            :product-template-list="alt"
        />
    </section>
</template>