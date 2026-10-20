<script lang="ts" setup>
import {
    AisConfigure,
    AisInstantSearchSsr,
    AisRefinementList,
    AisToggleRefinement,
    AisRangeInput,
    createServerRootMixin,
} from "vue-instantsearch/vue3/es";
import { renderToString } from 'vue/server-renderer';
import { history } from 'instantsearch.js/es/lib/routers';
import type { Category } from "~/graphql";

const props = defineProps<{
    indexName: string;
    category?: Category | object | any;
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
const searchClient = useSearchClient({ isCategoryPage: true })

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
                const state = {
                    [indexName.value]: {
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

const categoryFilter = ref('')
watch(
    () => props.category?.id,
    (id) => {
        categoryFilter.value = id ? `_all_categories in ['${id}']` : ''
    },
    { immediate: true }
)

const serverRootMixin = ref(
    createServerRootMixin({
        searchClient,
        indexName: indexName.value,
        future: {
            preserveSharedStateOnUnmount: true,
            persistHierarchicalRootCount: false,
        },
    })
)

const { instantsearch } = serverRootMixin.value.data()

provide('$_ais_ssrInstantSearchInstance', instantsearch)

const searchKey = `category-${props.category?.id ?? 'all'}`


const { data: ssrState } = useAsyncData(searchKey, async () => {
    if (import.meta.client) return null

    const currentFilter = props.category?.id
        ? `_all_categories in ['${props.category.id}']`
        : ''

    return instantsearch.findResultsState({
        component: {
            $options: {
                components: { AisInstantSearchSsr, AisConfigure, AisRefinementList, AisToggleRefinement, AisRangeInput },

                data() {
                    return { instantsearch }
                },

                provide: {
                    '$_ais_ssrInstantSearchInstance': instantsearch,
                },

                render() {
                    return h(AisInstantSearchSsr, null, () => [
                        h(AisConfigure, {
                            filters: currentFilter,
                            hitsPerPage: 80,
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
        :key="searchKey"
        :index-name="indexName"
        :search-client="searchClient"
        :routing="routing"
        :future="{
            preserveSharedStateOnUnmount: true,
            persistHierarchicalRootCount: false,
        }"
    >
        <AisConfigure
            :key="`category-configure-${props.category?.id}`"
            :filters="categoryFilter"
        />
        <CategoryHitsProvider>
            <CategoryJsonLd :category="props.category" />
        </CategoryHitsProvider>

        <slot></slot>
    </AisInstantSearchSsr>
</template>