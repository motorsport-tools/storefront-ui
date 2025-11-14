<script lang="ts" setup>
import { AisInstantSearch, AisConfigure } from "vue-instantsearch/vue3/es";

const props = defineProps<{
    indexName: string;
    category: any;
}>();

const route = useRoute()

const { indexName, category } = toRefs(props);
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
                        ...(routeState.brand ? { brand: routeState.brand } : {}),
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

const categoryFilter = computed(() => {
    if (!category.value?.id) return ''
    return `_all_categories in ['${category.value.id}']`
})
</script>

<template>
    <AisInstantSearch
        :indexName="indexName"
        :search-client="searchClient "
        :routing="routing"
        :future="{
            preserveSharedStateOnUnmount: true,
            persistHierarchicalRootCount: false,
        }"
    >   
        <AisConfigure 
            :filters="categoryFilter"
        />
        <slot name="default"></slot>
    </AisInstantSearch>
</template>