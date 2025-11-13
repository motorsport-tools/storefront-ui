<script lang="ts" setup>
import { AisInstantSearch } from "vue-instantsearch/vue3/es";
import { history } from 'instantsearch.js/es/lib/routers';

const props = defineProps<{
    indexName: string;
}>();

const { indexName } = toRefs(props);

const searchClient = useSearchClient()

const currentHitsPerPage = ref(80)
provide('hitsPerPage', currentHitsPerPage)

const routing = {
    router: history({cleanUrlOnDispose: false}),
    stateMapping: {
        stateToRoute(uiState: any) {
            const indexUiState = uiState['products'];
            if(indexUiState.hitsPerPage) {
                currentHitsPerPage.value = indexUiState.hitsPerPage
            }
            return {
                query: indexUiState.query,
                page: indexUiState.page,
                brands: indexUiState.refinementList?.brand,
                categories: indexUiState.hierarchicalMenu?._category_lvl0,
                price: indexUiState.refinementList?.price,
            };
        },
        routeToState(routeState: any) {
            return {
                products: {
                    query: routeState.query,
                    page: routeState.page,
                    refinementList: {
                        brand: routeState.brands,
                        fits: routeState.fits,
                        has_stock: routeState.has_stock,
                        price: routeState.price,
                        pagination: routeState.page
                    },
                    hierarchicalMenu: {
                        _category_lvl0: routeState.categories,
                    },
                },
            };
        },
    },
}
</script>

<template>
    <AisInstantSearch 
        ref="searchRef"
        :index-name="indexName"
        :search-client="searchClient "
        :routing="routing"
        :future="{
            preserveSharedStateOnUnmount: true,
            persistHierarchicalRootCount: false,
        }"
    >
        <slot name="default"></slot>
    </AisInstantSearch>
</template>