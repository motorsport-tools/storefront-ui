<script setup lang="ts">
import { useWebsiteHomePage } from '~/domains/core/composable/useWebsiteHomePage'
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'

const { getWebsiteHomepage, websiteHomepage } = useWebsiteHomePage()

const { list } = useRecentViewProducts()

await getWebsiteHomepage()

useHead(generateSeo<SeoEntity>(websiteHomepage.value, 'Home'))
</script>

<script setup lang="ts">
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
    <section class="pb-16">
      <LazyProductSlider key="inspired-by-picks" heading="Inspired by your picks" key-for-composable="inspired-by-picks"
        hydrate-on-visible />
    </section>
    <section v-if="list?.length > 0" class="pb-16">
      <ClientOnly>
        <LazyProductSlider key="recent-views" heading="Your recent views" :ids="list" key-for-composable="recent-views" />
      </ClientOnly>
    </section>
  </main>
</template>
