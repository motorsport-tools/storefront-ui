<script setup lang="ts">
import { type BlockProduct } from '../../shared/types/schema'
import ClerkSlider from '~/layers/clerkio/components/ui/ClerkSlider.vue';
interface Props {
    blockData: BlockProduct
}
const props = defineProps<Props>()

const { loading, data: products, loadProductData } = useProductList(`product-slider--block-${props.blockData.id}`)

const getParams = (data: BlockProduct) => {
  const params: Record<string, any> = {
    pageSize: data?.number_products || 10,
    sort: data?.sort_by && data?.sort_direction ? { [data.sort_by]: data.sort_direction } : { "newest": "ASC" },
  }
  if (data?.tag) params.tag = data.tag
  return params
}

// Pre-fetch during SSR / component setup
await loadProductData(getParams(props.blockData))

watch(
  () => props.blockData,
  async (newVal) => {
    if (newVal) {
      await loadProductData(getParams(newVal))
    }
  },
  { deep: true }
)

</script>
<template>
    <ClerkSlider
        :heading="blockData?.title"
        :product-template-list="products || []"
        :blockId="props.blockData.id"
        :loading="loading"
    />
</template>