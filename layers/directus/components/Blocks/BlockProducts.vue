<script setup lang="ts">
import { type BlockProduct } from '../../shared/types/schema'
interface Props {
    blockData: BlockProduct
}
const props = defineProps<Props>()

const { loadProductTemplateList, productTemplateList } = useProductTemplateList('')

await loadProductTemplateList({ pageSize: props.blockData?.number_products || 10 })

</script>
<template>
    <LazyProductSlider
      :heading="blockData.title"
      :product-template-list="productTemplateList"
    />
</template>