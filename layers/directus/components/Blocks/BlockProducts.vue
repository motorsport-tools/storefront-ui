<script setup lang="ts">
import { type BlockProduct } from '../../shared/types/schema'
interface Props {
    blockData: BlockProduct
}
const props = defineProps<Props>()

const { loadProductTemplateList, productTemplateList } = useProductTemplateList(`product-slider--block-${props.blockData.id}`)

const sliderKey = ref(0)

watch(
  () => props.blockData,
  async (newVal) => {
    await loadProductTemplateList({ pageSize: newVal?.number_products || 10 });
    sliderKey.value++;
  },
  { immediate: true, deep: true }
);

</script>
<template>
    <ProductSlider
      :key="sliderKey"
      :heading="blockData.title"
      :product-template-list="productTemplateList"
      :blockId="props.blockData.id"
    />
</template>