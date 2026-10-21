<script lang="ts" setup>
import {
    AisConfigure,
    AisInstantSearchSsr,
    AisRefinementList,
    AisToggleRefinement,
    AisRangeInput,
    createServerRootMixin,
} from "vue-instantsearch/vue3/es";
import { SearchHiddenBox } from '#components'
import { renderToString } from 'vue/server-renderer';
import type { Category } from "~/graphql";

const props = defineProps<{
    indexName: string;
    category?: Category | object | any;
}>();

useHead({
    link: [{ rel: 'preconnect', href: 'https://api.clerk.io', crossorigin: '' }]
})

const { indexName } = toRefs(props);
const searchClient = useSearchClient({ isCategoryPage: true })

const currentHitsPerPage = ref(80)
provide('hitsPerPage', currentHitsPerPage)

const { createNuxtRouter } = useSearchRouter()

const routing = {
    router: createNuxtRouter(),
    stateMapping: {
        stateToRoute(uiState: any) {
            const s = uiState[indexName.value] || {}
            return {
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

const categoryFilter = ref('')
watch(
    () => props.category?.id,
    (id) => {
        categoryFilter.value = id ? `_all_categories in ['${id}']` : ''
    },
    { immediate: true }
)

const serverRootMixin = createServerRootMixin({
    searchClient,
    indexName: indexName.value,
    routing,
    initialUiState: routing.stateMapping.routeToState(routing.router.read()),
    future: {
        preserveSharedStateOnUnmount: true,
        persistHierarchicalRootCount: false,
    },
})

const { instantsearch } = serverRootMixin.data()
provide('$_ais_ssrInstantSearchInstance', instantsearch)

const route = useRoute()

const normQuery = () =>
    Object.keys(route.query).sort()
        .map(k => `${k}=${[].concat(route.query[k] as any).join(',')}`)
        .join('&')

const searchKey = `category-${props.category?.id ?? 'all'}-${normQuery()}`

const { data: ssrState } = useAsyncData(searchKey, async () => {
    const currentFilter = props.category?.id
        ? `_all_categories in ['${props.category.id}']`
        : ''

    return instantsearch.findResultsState({
        component: {
            $options: {
                components: { AisInstantSearchSsr, AisConfigure, SearchHiddenBox,AisRefinementList, AisToggleRefinement, AisRangeInput },

                data() {
                    return { instantsearch }
                },

                provide: {
                    '$_ais_ssrInstantSearchInstance': instantsearch,
                },

                render() {
                    const HiddenBoxComponent = resolveComponent('SearchHiddenBox')
                    return h(AisInstantSearchSsr, null, () => [
                        h(AisConfigure, {
                            filters: currentFilter,
                            hitsPerPage: currentHitsPerPage.value,
                        }),
                        h(HiddenBoxComponent),
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
        <AisConfigure
            :key="`category-configure-${props.category?.id}`"
            :filters="categoryFilter"
            :hits-per-page="currentHitsPerPage"
        />
        <SearchHiddenBox />
        <CategoryHitsProvider>
            <CategoryJsonLd :category="props.category" />
        </CategoryHitsProvider>
        <slot></slot>
    </AisInstantSearchSsr>
</template>