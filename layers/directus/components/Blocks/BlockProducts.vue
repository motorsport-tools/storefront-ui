<script setup lang="ts">
import { type BlockProduct } from '../../shared/types/schema'
interface Props {
    blockData: BlockProduct
}
const props = defineProps<Props>()

const { loadProductTemplateList, productTemplateList } = useProductTemplateList(`product-slider--block-${props.blockData.id}`)

await loadProductTemplateList({ pageSize: props.blockData?.number_products || 10 })

const sliderKey = ref(0)

watch(() => productTemplateList, () => {
  sliderKey.value++
})



</script>
<template>
    <ProductSlider
      :heading="blockData.title"
      :product-template-list="productTemplateList"
      :blockId="props.blockData.id"
    />
</template>