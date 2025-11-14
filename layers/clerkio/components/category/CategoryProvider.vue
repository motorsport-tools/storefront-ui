<script lang="ts" setup>
import { AisInstantSearch, AisConfigure } from "vue-instantsearch/vue3/es";
import { history } from 'instantsearch.js/es/lib/routers';
import type { Category } from "~/graphql";
const props = defineProps<{
    indexName: string;
    category?: object | any;
}>();

const { indexName } = toRefs(props);
const searchClient = useSearchClient({ isCategoryPage: true })

const currentHitsPerPage = ref(80)
provide('hitsPerPage', currentHitsPerPage)

const routing = {
    router: history({
        cleanUrlOnDispose: false
    }),
    stateMapping: {
          stateToRoute(uiState) {
            const indexState = uiState[indexName.value]

            if(indexState.hitsPerPage) {
                currentHitsPerPage.value = indexState.hitsPerPage
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
const categoryFilter = ref('')
watch(
  () => props.category?.id,
  (id) => {
    if (id) {
      categoryFilter.value = `_all_categories in ['${id}']`
    } else {
      categoryFilter.value = ''
    }
  },{immediate: true}
)
</script>

<template>
    <AisInstantSearch
        :key="`category-${props.category?.id}`"
        :indexName="indexName"
        :search-client="searchClient "
        :routing="routing"
        :future="{
            preserveSharedStateOnUnmount: true,
            persistHierarchicalRootCount: false,
        }"
    >   
        <AisConfigure
            :key="`category-${props.category?.id}`"
            :filters="categoryFilter"
        />
        <slot name="default"></slot>
    </AisInstantSearch>
</template>