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
    const params: Record<string, any> = {
      pageSize: newVal?.number_products || 10,
    }

  if (newVal?.tag) params.tag = newVal.tag;
  if (newVal?.tag_id) params.tagId = newVal.tag_id;
  console.log(  'Loading product template list with params:', params);
    await loadProductTemplateList(params);
    sliderKey.value++;
  },
  { immediate: true, deep: true }
);

</script>
<template>
    <ProductSlider
      :key="sliderKey"
      :heading="blockData?.title"
      :product-template-list="productTemplateList"
      :blockId="props.blockData.id"
    />
</template>