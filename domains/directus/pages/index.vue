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
    class="w-full xl:narrow-container mb-20"
    data-testid="checkout-layout"
  >
    
    <HomeSlider class="mb-6 md:max-w-screen-3xl" />
    <div class="mx-6">
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
    </div>
  </main>
</template>