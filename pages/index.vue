<script setup lang="ts">
import type { QueryProductsArgs } from '~/graphql'
import { useWebsiteHomePage } from '~/domains/core/composable/useWebsiteHomePage'
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

const { $posthog } = useNuxtApp();
if ($posthog) {
  const posthog = $posthog()
  posthog?.capture('<event_name>')
}
</script>

<template>
  <main 
    class="w-full narrow-container bg-white mb-20"
    data-testid="checkout-layout"
  >
    <MainBanner />
    <LazyDisplay hydrate-on-visible />
    <ClientOnly>
      <LazyRecentViewSlider heading="Your recent views" />
    </ClientOnly>
  </main>
</template>
