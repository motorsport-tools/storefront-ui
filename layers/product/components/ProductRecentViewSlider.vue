<script lang="ts" setup>
const props = defineProps({
  heading: {
    type: String,
    default: '',
    required: false,
  },
})

const { loadProductTemplateList, productTemplateList }
  = useProductTemplateListForRecentViews()

await loadProductTemplateList()
</script>

<template>
  <section v-if="productTemplateList?.length > 0">
    <LazyProductSlider
      :heading="props.heading"
      :product-template-list="productTemplateList"
    />
  </section>
</template>

<style>

</style>