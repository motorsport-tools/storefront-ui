<script setup lang="ts">
import { SfButton } from '@storefront-ui/vue'
import { useWebsiteHomePage } from '~/layers/core/composable/useWebsiteHomePage'
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'

import { withLeadingSlash, withoutTrailingSlash } from 'ufo'
import VisualEditor from '~/layers/directus/components/VisualEditor.vue'

const { getWebsiteHomepage, websiteHomepage } = useWebsiteHomePage()

await getWebsiteHomepage()

useHead(generateSeo<SeoEntity>(websiteHomepage.value, 'Home'))

const route = useRoute()
const { enabled, state } = useLivePreview()
const pageUrl = useRequestURL()
const { isVisualEditingEnabled, apply } = useVisualEditing()

const permalink = withoutTrailingSlash(withLeadingSlash(route.path))

const {
	data: page,
	error,
	refresh,
} = await useFetch<Page>('/api/pages/one', {
	key: `pages-${permalink}`,
	query: {
		permalink,
		preview: enabled.value ? true : undefined,
		token: enabled.value ? state.token : undefined,
	},
})

function applyVisualEditing() {
	apply({
		onSaved: async () => {
			await refresh();
		},
	})
}

function applyVisualEditingButton() {
	apply({
		elements: document.querySelector('#visual-editing-button') as HTMLElement,
		customClass: 'visual-editing-button-class',
		onSaved: async () => {
			await refresh()
			// This makes sure the visual editor elements are updated after the page is refreshed. In case you've added new blocks to the page.
			await nextTick()
			applyVisualEditing()
		},
	})
}

onMounted(() => {
	if (!isVisualEditingEnabled.value) return;
	applyVisualEditingButton()
	applyVisualEditing()
})
</script>

<template>
  <main 
    class="w-full narrow-container bg-white mb-20"
    data-testid="checkout-layout"
  >
    
    <MainBanner />
    <LazyDisplay hydrate-on-visible />
    <ClientOnly>
      <LazyProductRecentViewSlider heading="Your recent views" />
    </ClientOnly>
    
  </main>

  <VisualEditor
    :page="page"
  />
</template>
