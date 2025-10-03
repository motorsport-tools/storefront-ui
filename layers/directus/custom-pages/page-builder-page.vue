<script setup lang="ts">
import { withLeadingSlash, withoutTrailingSlash } from 'ufo'
import type { Page } from '../shared/types/schema'
import VisualEditor from '~/layers/directus/components/VisualEditor.vue'
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'
import { getDirectusAssetURL } from '@directus-utils/directus-utils'

const route = useRoute()
const baseUrl = useRequestURL().origin
const { enabled, state } = useLivePreview()
const permalink = withoutTrailingSlash(withLeadingSlash(route.path))
const { isVisualEditingEnabled, apply } = useVisualEditing()

const cacheKey = `pages-directus-${permalink}`

const globals = useNuxtApp().payload?.data['site-data']

const {
	data: page,
	error,
	refresh,
} = await useFetch<Page>('/api/pages/one', {
	key: cacheKey,
	query: {
		permalink,
		preview: enabled.value ? true : undefined,
		token: enabled.value ? state.token : undefined
	},
})

if (!page.value || error.value) {
	throw createError({ statusCode: 404, statusMessage: 'Page not found - page', fatal: true });
}
const seo = page.value.seo
if(seo) {
    const robots = `${seo.no_index ? 'noindex' : 'index'},${seo.no_follow ? 'nofollow' : 'follow'}`
    
    const seoData = {
        ...(seo.title ? { metaTitle: seo.title }: null),
        ...(seo.meta_description ? { metaDescription: seo.meta_description }: null),
        ...(seo.og_image ? { metaImage: getDirectusAssetURL(seo.og_image) } : null),
        ...(seo.focus_keyphrase ? { metaKeyword: seo.focus_keyphrase } : null ),
        robots: robots,
        jsonLd: {
            "@context": "https://schema.org/",
            "@type": "WebPage",
            "name": `${seo.title}`,
            "description": `${seo.meta_description}`,
            "publisher": {
                "@type": "Organization",
                "name": `${globals.organization}`
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${baseUrl + route.path}`
            }
        }

        
    }
    useHead(generateSeo<SeoEntity>(seoData, 'Page'))
}

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
            <pre v-if="enabled">
                {{ page }}
            </pre>
        </NuxtErrorBoundary>
    </main>
    <ClientOnly>
        <VisualEditor
            v-if="isVisualEditingEnabled"
            :page="page"
        />
    </ClientOnly>
</template>
<style>
/* beasties:exclude */
.directus-visual-editing-overlay.visual-editing-button-class .directus-visual-editing-edit-button {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	transform: none;
	background: transparent;
}
</style>