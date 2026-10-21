<script lang="ts" setup>
import {
    AisInstantSearchSsr,
    AisConfigure,
    AisRefinementList,
    AisToggleRefinement,
    AisRangeInput,
    AisHierarchicalMenu,
    createServerRootMixin,
} from "vue-instantsearch/vue3/es";
import { SearchHiddenBox } from '#components'
import { renderToString } from 'vue/server-renderer';

const props = defineProps<{
    indexName: string;
}>();

useHead({
    link: [
        {
            rel: 'preconnect',
            href: 'https://api.clerk.io',
            crossorigin: '',
        }
    ]
})

const { indexName } = toRefs(props);
const searchClient = useSearchClient()

const currentHitsPerPage = ref(80)
provide('hitsPerPage', currentHitsPerPage)

const { createNuxtRouter } = useSearchRouter()

const routing = {
    router: createNuxtRouter(),
    stateMapping: {
        stateToRoute(uiState: any) {
            const s = uiState[indexName.value] || {}
            return {
                q: s.query,
                categories: s.hierarchicalMenu?._category_lvl0,
                brands: s.refinementList?.brand,
                fits: s.refinementList?.fits,
                has_stock: s.toggle?.has_stock,
                on_sale: s.toggle?.on_sale,
                price: s.range?.price,
                page: s.page && s.page > 1 ? s.page : undefined,
                limit: s.hitsPerPage,
            }
        },
        routeToState(r: any) {
            const state: any = {
                query: r.q,
                hierarchicalMenu: r.categories ? { _category_lvl0: r.categories } : {},
                refinementList: {
                    ...(r.brands ? { brand: r.brands } : {}),
                    ...(r.fits ? { fits: r.fits } : {}),
                },
                toggle: {
                    ...(r.has_stock === 'true' ? { has_stock: true } : {}),
                    ...(r.on_sale === 'true' ? { on_sale: true } : {}),
                },
                range: r.price ? { price: r.price } : {},
            }
            if (r.page) state.page = Number(r.page)
            if (r.limit) {
                state.hitsPerPage = Number(r.limit)
                currentHitsPerPage.value = Number(r.limit)
            }
            return { [indexName.value]: state }
        },
    },
}

const serverRootMixin = createServerRootMixin({
    searchClient,
    indexName: indexName.value,
    routing: routing,
    future: {
        preserveSharedStateOnUnmount: true,
        persistHierarchicalRootCount: true,
    },
})

const { instantsearch } = serverRootMixin.data()

provide('$_ais_ssrInstantSearchInstance', instantsearch)

const route = useRoute()

const normQuery = () =>
    Object.keys(route.query).sort()
        .map(k => `${k}=${[].concat(route.query[k] as any).join(',')}`)
        .join('&')

const searchKey = `search-${indexName.value}-${normQuery()}`

const { data: ssrState } = useAsyncData(searchKey, async () => {
    if (import.meta.client) return null

    return instantsearch.findResultsState({
        component: {
            $options: {
                components: {
                    AisInstantSearchSsr,
                    AisConfigure,
                    SearchHiddenBox,
                    AisRefinementList,
                    AisToggleRefinement,
                    AisRangeInput,
                    AisHierarchicalMenu,
                },

                data() {
                    return { instantsearch }
                },

                provide: {
                    '$_ais_ssrInstantSearchInstance': instantsearch,
                },

                render() {
                    const HiddenBoxComponent = resolveComponent('SearchHiddenBox')
                    return h(AisInstantSearchSsr, null, () => [
                        h(AisConfigure, { hitsPerPage: 80 }),
                        h(HiddenBoxComponent),
                        h(AisHierarchicalMenu, {
                            attributes: [
                                '_category_lvl0', '_category_lvl1', '_category_lvl2',
                                '_category_lvl3', '_category_lvl4', '_category_lvl5', '_category_lvl6',
                            ],
                        }),
                        h(AisRefinementList, { attribute: 'brand', operator: 'or', showMoreLimit: 200 }),
                        h(AisRefinementList, { attribute: 'fits', operator: 'or' }),
                        h(AisToggleRefinement, { attribute: 'has_stock' }),
                        h(AisToggleRefinement, { attribute: 'on_sale' }),
                        h(AisRangeInput, { attribute: 'price' }),
                    ])
                },
            },
        },
        renderToString,
    })
})

onBeforeMount(() => {
    if (ssrState.value) {
        instantsearch.hydrate(ssrState.value)
    }
})
</script>

<template>
    <AisInstantSearchSsr>
        <SearchHiddenBox />
        <slot name="default"></slot>
    </AisInstantSearchSsr>
</template>