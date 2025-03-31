<script setup lang="ts">
import { useWebsiteHomePage } from '~/domains/core/composable/useWebsiteHomePage'
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'

const { getWebsiteHomepage, websiteHomepage } = useWebsiteHomePage()

const { list } = useRecentViewProducts()
await getWebsiteHomepage()

useHead(generateSeo<SeoEntity>(websiteHomepage.value, 'Home'))
</script>

<template>
  <main 
    class="w-full narrow-container bg-white mb-20"
    data-testid="checkout-layout"
  >
    <MainBanner />
    <LazyDisplay hydrate-on-visible />
    <section class="pb-16">
      <LazyProductSlider
        key="inspired-by-picks"
        heading="Inspired by your picks"
        key-for-composable="inspired-by-picks"
      />
    </section>
    <section
      class="pb-16"
    >
      <ClientOnly>
        <LazyProductSlider
          v-if="list?.length > 0"
          key="recent-views"
          heading="Your recent views"
          :ids="list"
          key-for-composable="recent-views"
        />
      </ClientOnly>
    </section>
  
  </main>
</template>