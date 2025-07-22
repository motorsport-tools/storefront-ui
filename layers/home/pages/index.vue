<script setup lang="ts">
import { useWebsiteHomePage } from '~/layers/core/composable/useWebsiteHomePage'
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'

import { withLeadingSlash, withoutTrailingSlash } from 'ufo'

const { getWebsiteHomepage, websiteHomepage } = useWebsiteHomePage()

await getWebsiteHomepage()

useHead(generateSeo<SeoEntity>(websiteHomepage.value, 'Home'))

const route = useRoute()
const { enabled, state } = useLivePreview()
const pageUrl = useRequestURL()
const { isVisualEditingEnabled, apply, setAttr } = useVisualEditing()

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
  <div
			v-if="isVisualEditingEnabled && page"
			class="fixed z-50 w-full bottom-4 left-0 right-0 p-4 flex justify-center items-center gap-2"
		>
			<!-- If you're not using the visual editor it's safe to remove this element. Just a helper to let editors add edit / add new blocks to a page. -->
			<Button
				id="visual-editing-button"
				variant="secondary"
				:data-directus="
					setAttr({ collection: 'pages', item: page.id, fields: ['blocks', 'meta_m2a_button'], mode: 'modal' })
				"
			>
				<Icon name="lucide:pencil" />
				Edit All Blocks
			</Button>
		</div>

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
</template>
