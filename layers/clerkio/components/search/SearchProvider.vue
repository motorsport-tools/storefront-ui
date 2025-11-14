<script lang="ts" setup>
import { AisInstantSearch, AisConfigure } from "vue-instantsearch/vue3/es";

//= defineAsyncComponent(() => import('../../widgets/HiddenBox.vue'))

const props = defineProps<{
    indexName: string;
}>();

const route = useRoute()

const { indexName } = toRefs(props);
const searchClient = useSearchClient()

const currentHitsPerPage = ref(80)
provide('hitsPerPage', currentHitsPerPage)

const routing = {
    stateMapping: {
          stateToRoute(uiState) {
            const indexState = uiState[indexName.value]

            if(indexName.hitsPerPage) {
                currentHitsPerPage.value = indexName.hitsPerPage
            }

            return {
                q: indexState.query,
                categories: indexState.hierarchicalMenu && indexState.hierarchicalMenu._category_lvl0,
                brands: indexState.refinementList && indexState.refinementList.brand,
                has_stock: indexState.toggle && indexState.toggle.has_stock,
                on_sale: indexState.toggle && indexState.toggle.on_sale,
                fits: indexState.refinementList && indexState.refinementList.fits,
                price: indexState.refinementList && indexState.refinementList.price,
                page: indexState.page,
                limit: indexState.hitsPerPage
            }

          },
          routeToState(routeState) {
            const state = {
                [indexName.value]: {
                    query: routeState.q,
                    hierarchicalMenu: {
                        _category_lvl0: routeState.categories || []
                    },
                    refinementList: {
                        ...(routeState.brands ? { brand: routeState.brands } : {}),
                        ...(routeState.fits ? { fits: routeState.fits } : {}),
                        ...(routeState.has_stock ? { has_stock: routeState.has_stock } : {}),
                        ...(routeState.on_sale ? { on_sale: routeState.on_sale } : {})
                    }
                }
            }
            if(routeState.page) {
                state[indexName.value].page = Number(routeState.page)
            }

            return state
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
        <!-- <HiddenBox/> -->
        <slot name="default"></slot>
    </AisInstantSearch>
</template>