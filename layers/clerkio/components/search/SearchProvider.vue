<script lang="ts" setup>
import {
    AisInstantSearchSsr,
    AisConfigure,
    AisRefinementList,
    AisToggleRefinement,
    AisRangeInput,
    AisHierarchicalMenu,
    AisSearchBox,
    createServerRootMixin,
} from "vue-instantsearch/vue3/es";
import { SearchHiddenBox } from '#components'
import { renderToString } from 'vue/server-renderer';
import { history } from 'instantsearch.js/es/lib/routers';

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

const routing = import.meta.server
    ? undefined
    : {
        router: history({
            cleanUrlOnDispose: false,
        }),
        stateMapping: {
            stateToRoute(uiState) {
                const indexState = uiState[indexName.value]
                if (indexState?.hitsPerPage) {
                    currentHitsPerPage.value = indexState.hitsPerPage
                }

                return {
                    q: indexState?.query,
                    categories: indexState?.hierarchicalMenu?._category_lvl0,
                    brands: indexState?.refinementList?.brand,
                    has_stock: indexState?.toggle?.has_stock,
                    on_sale: indexState?.toggle?.on_sale,
                    fits: indexState?.refinementList?.fits,
                    price: indexState?.refinementList?.price,
                    page: indexState?.page,
                    limit: indexState?.hitsPerPage,
                }
            },
            routeToState(routeState) {
                console.log('[AIS routeToState]', JSON.stringify(routeState))
                const state = {
                    [indexName.value]: {
                        query: routeState.q,
                        hierarchicalMenu: {
                            ...(routeState.categories ? { _category_lvl0: routeState.categories } : {}),
                        },
                        refinementList: {
                            ...(routeState.brands ? { brand: routeState.brands } : {}),
                            ...(routeState.fits ? { fits: routeState.fits } : {}),
                        },
                        toggle: {
                            ...(routeState.has_stock ? { has_stock: routeState.has_stock } : {}),
                            ...(routeState.on_sale ? { on_sale: routeState.on_sale } : {}),
                        },
                    } as any,
                }
                if (routeState.page) {
                    state[indexName.value].page = Number(routeState.page)
                }
                if (routeState.limit) {
                    state[indexName.value].hitsPerPage = Number(routeState.limit)
                }

                return state
            },
        },
    }

const route = useRoute()
const q = String(Array.isArray(route.query.q) ? route.query.q[0] : route.query.q ?? '')

const serverRootMixin = ref(
    createServerRootMixin({
        searchClient,
        indexName: indexName.value,
        initialUiState: { [indexName.value]: { query: q } },
        future: {
            preserveSharedStateOnUnmount: true,
            persistHierarchicalRootCount: true,
        },
    })
)

const { instantsearch } = serverRootMixin.value.data()

provide('$_ais_ssrInstantSearchInstance', instantsearch)

const searchKey = `search-${indexName.value}`

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
                    return h(AisInstantSearchSsr, null, () => [
                        h(AisConfigure, { hitsPerPage: 80 }),
                        h(SearchHiddenBox),
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
    <AisInstantSearchSsr
        :index-name="indexName"
        :search-client="searchClient"
        :routing="routing"
        :future="{
            preserveSharedStateOnUnmount: true,
            persistHierarchicalRootCount: false,
        }"
    >
        <SearchHiddenBox />
        <slot name="default"></slot>
    </AisInstantSearchSsr>
</template>