<script lang="ts" setup>
import { SfLoaderCircular } from '@storefront-ui/vue' 
import ClerkSlider from '~/layers/clerkio/components/ui/ClerkSlider.vue'
const props = defineProps({
  heading: {
    type: String,
    default: '',
    required: false,
  },
})
const { list, loading, data: recentProducts, getRecentViewsData } = useRecentViews()

watch(
  () => JSON.stringify(list.value || []),
  async () => {
    await getRecentViewsData(10)
  },
  { immediate: true },
)
</script>

<template>
  <section v-if="list && list.length > 0" class="my-4">
    <div v-if="loading" class="w-full text-center">
      <SfLoaderCircular
          size="xl"
          class="mt-[160px]"
      />
    </div>
    <div v-else-if="!loading && recentProducts && recentProducts.length > 0">
      <ClerkSlider
        :heading="$t('recentViews')"
        :product-template-list="recentProducts"
      />
    </div>
  </section>
  <!--
  <section v-if="productTemplateList?.length > 0">
    <LazyProductSlider
      :heading="props.heading"
      :product-template-list="productTemplateList"
    />
  </section>
  -->
</template>

<style>

</style>
