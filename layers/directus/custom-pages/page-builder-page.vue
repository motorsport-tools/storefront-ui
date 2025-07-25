<script setup lang="ts">
import { withLeadingSlash, withoutTrailingSlash } from 'ufo'
import type { Page } from '../shared/types/schema'

const route = useRoute()
const { enabled, state } = useLivePreview()
const permalink = withoutTrailingSlash(withLeadingSlash(route.path))
const { isVisualEditingEnabled, apply, setAttr } = useVisualEditing()

const token = enabled.value ? state.token : ''
const preview = enabled.value ? true : false
const cacheKey = `pages-directus-${permalink}`

const {
	data: page,
	error,
	refresh,
} = await useFetch<Page>('/api/pages/one', {
	key: cacheKey,
	query: {
		permalink,
		preview: enabled.value ? true : undefined,
		token: enabled.value ? state.token : undefined,
	},
})

if (!page.value || error.value) {
	throw createError({ statusCode: 404, statusMessage: 'Page not found - page', fatal: true });
}

useHead({

})

function applyVisualEditing() {
	apply({
		onSaved: async () => {
			await refresh();
		},
	});
}

function applyVisualEditingButton() {
	apply({
		elements: document.querySelector('#visual-editing-button') as HTMLElement,
		customClass: 'visual-editing-button-class',
		onSaved: async () => {
			await refresh();
			// This makes sure the visual editor elements are updated after the page is refreshed. In case you've added new blocks to the page.
			await nextTick();
			applyVisualEditing();
		},
	})
}

onMounted(() => {
	if (!isVisualEditingEnabled.value) return;
	applyVisualEditingButton();
	applyVisualEditing();
})

console.log('Page', page.value)
</script>
<template>
    <main 
        class="w-full"
        data-testid="page-builder-page"
    >
        <NuxtErrorBoundary> 
            <PageBuilderSection 
                v-for="(section, index) in page.sections"
                :key="`section-${index}`"
                :sectionData="section.item"
            />
                
            <section 
                class="w-full py-5"
                style="background:pink;"
            >
                <h2>Full Width?</h2>
                <p>This should be a fullwidth section</p>
            </section>
        </NuxtErrorBoundary>
    </main>
</template>