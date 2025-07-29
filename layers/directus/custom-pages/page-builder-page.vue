<script setup lang="ts">
import { withLeadingSlash, withoutTrailingSlash } from 'ufo'
import type { Page } from '../shared/types/schema'
import VisualEditor from '~/layers/directus/components/VisualEditor.vue'

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

</script>
<template>
    <main 
        class="w-full"
        data-testid="page-builder-page"
    >
        <NuxtErrorBoundary> 
            <PageBuilderSection 
                v-for="(section, index) in page?.sections"
                :key="`section-${index}`"
                :sectionData="section?.item || {}"
            />
            <pre>
                {{ page }}
            </pre>
        </NuxtErrorBoundary>
    </main>
    <ClientOnly>
        <VisualEditor
            :page="page"
        />
    </ClientOnly>
</template>