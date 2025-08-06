<script setup lang="ts">
import { type BlockProduct } from '../../shared/types/schema'
interface Props {
    blockData: BlockProduct
}
const props = defineProps<Props>()

const { loadProductTemplateList, productTemplateList, loading } = useProductTemplateList(`product-slider--block-${props.blockData.id}`)
 
await loadProductTemplateList({ pageSize: props.blockData?.number_products || 10 })


</script>
<template>
    <ProductSlider
      :heading="blockData.title"
      :product-template-list="productTemplateList"
      :blockId="props.blockData.id"
    />
</template>