<script setup lang="ts">
import { withLeadingSlash, withoutTrailingSlash } from 'ufo'
import type { Page } from '../shared/types/schema'

const route = useRoute()
const { enabled, state } = useLivePreview()
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

if (!page.value || error.value) {
	throw createError({ statusCode: 404, statusMessage: 'Page not found - page', fatal: true });
}

useHead({

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