<script setup lang="ts">
interface Props {
    fbt: any 
    loading: boolean,
}
const props = defineProps<Props>()
</script>
<template>
    <section
        v-if="!loading && fbt"
        class="lg:mx-4 mt-28"
    >
        <LazyProductSlider
            heading="Recommended with this product"
            :product-template-list="fbt"
        />
    </section>
</template>