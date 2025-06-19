<script setup lang="ts">
import type { QueryProductsArgs } from '~/graphql'
import { useWebsiteHomePage } from '~/layers/core/composable/useWebsiteHomePage'
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'

const { getWebsiteHomepage, websiteHomepage } = useWebsiteHomePage()

const { list } = useRecentViewProducts()

const { loadProductTemplateList, productTemplateList } = useProductTemplateList('recent-views', 'recent-views')

const numOfProducts = 10
const params: QueryProductsArgs = { pageSize: numOfProducts }

if (list.value?.length > 0) {
  params.filter = { ids: list.value } as any
}

await loadProductTemplateList(params, true)

await getWebsiteHomepage()
useHead(generateSeo<SeoEntity>(websiteHomepage.value, 'Home'))
</script>

<template>
  <main 
    class="w-full narrow-container bg-white mb-20"
    data-testid="checkout-layout"
  >
    <!--
    <MainBanner />
    <LazyDisplay hydrate-on-visible />
    <ClientOnly>
      <LazyProductRecentViewSlider heading="Your recent views" />
    </ClientOnly>
    -->
    <p>Content</p>
  </main>
</template>
