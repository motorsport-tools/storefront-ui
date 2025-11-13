<script setup lang="ts">
import type { Category } from '~/graphql'
import type { Node as menuNode } from '#layers/header/types'
import { getCategoryLabel, isCategoryOrChildSelected } from '../../utils/categories';
const route = useRoute()
const router = useRouter()
const emit = defineEmits(["close"]);

interface Props {
    selectedFacets: Ref<Record<string, string[]>>
    availableFacets: Ref<ClerkFacets>
    setFacet: (key: string, value: string | number | boolean) => void
    facetStats: Ref<Record<string, Object[]>>
    filterCount: number
    loading: boolean
    isCategory: boolean //Is Category Page (has different Menu - just links to click)
    categoryId: string
}

const props = defineProps<Props>()

const clearFilters = () => {
    props.selectedFacets.value = {};
    let clearQuery = { query: {} }
    if(route.query.search) {
        clearQuery.query.search = route.query.search?.toString()
    }
    router.push(clearQuery);
    emit("close");
}

const categoriesForMegaMenu = inject<Ref<menuNode[]> | undefined>('categoriesForMegaMenu')

const categories = computed(() => categoriesForMegaMenu?.value ?? [])

interface ClerkFacetValue {
    v: string
    c: number
}

const rootCategoryCounts = useState('rootCategoryCounts')

function aggregateCategoryFacets(menuNode:menuNode[], clerkFacets:Array<ClerkFacetValue>) {
  // Create a map of category key to count from Clerk facets
  const categoryCountMap = new Map();
  
  if (clerkFacets && clerkFacets.length > 0) {
    clerkFacets.forEach(facet => {
      categoryCountMap.set(String(facet.v), facet.c);
    });
  }
  
  // Recursive function to calculate total count for a node and its children
  function calculateTotalCount(node:any) {
    // Skip root node in count calculation
    if (node.key === 'root') {
      let total = 0;
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          total += calculateTotalCount(child);
        });
      }
      return total;
    }
    
    // Get direct count for this category
    let totalCount = categoryCountMap.get(node.key) || 0;
    
    // Add counts from all children recursively
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        totalCount += calculateTotalCount(child);
      });
    }
    
    return totalCount;
  }
  
  // Build the result with aggregated counts in value.counter
  function buildCategoryWithCounts(node) {
    const totalCount = calculateTotalCount(node);
    
    const result = {
      key: node.key,
      value: {
        ...node.value,
        counter: totalCount
      },
      isLeaf: node.isLeaf
    };
    
    if (node.children && node.children.length > 0) {
      result.children = node.children.map(buildCategoryWithCounts);
    }
    
    return result;
  }
  
  return buildCategoryWithCounts(menuNode);
}

watch(
  [() => categories.value, () => props.availableFacets?.categories],
  ([cats, facets]) => {
    if (!cats || !facets) return // wait until both are populated
    if (!rootCategoryCounts.value) {
      rootCategoryCounts.value = aggregateCategoryFacets(cats, facets)
    }
  },
  { immediate: true }
)

watch(
  [() => route.query.search],
  ([newSearch, oldSearch]) => {
    if (newSearch !== oldSearch) {
      // reset root count cache
      if (rootCategoryCounts.value) {
        rootCategoryCounts.value = null
      }
    }
  }
)

const mergedCategories = computed(() => {
    return rootCategoryCounts.value ?? categories.value
})




const expandedFacets = reactive<Record<string, boolean>>({})
const SHOW_LIMIT = 8
const visibleFacets = computed(() => {
    const facets = { ...props.availableFacets }
    if(facets['categories']) {
        delete facets['categories']
    }
    return facets
})

const handleSetFacet = (key: string, value: string | number | boolean) => {
    props.setFacet(key, value)

    if(key === 'categories') {
        const loop = (nodes) => {
            for (const cat of nodes) {
                if (cat.key === value) {
                    if (cat.children?.length) {
                        const unsetChildren = (node: any) => {
                            node.children?.forEach(child => {
                                if (props.selectedFacets[key]?.includes(child.key)) {
                                    props.setFacet(key, child.key)
                                }
                                unsetChildren(child)
                            })
                        }
                        unsetChildren(cat)
                    }
                    return
                }
                if (cat.children?.length) loop(cat.children)
            }
        }

        loop(mergedCategories.value.children)
    }
}

watch(
    () => mergedCategories.value,
    (cats) => {
        if (!cats?.children || !props.selectedFacets) return
        const selected = props.selectedFacets['categories'] ?? []
        cats.children.forEach(cat => {
            const shouldExpand = isCategoryOrChildSelected(cat, selected)
            expandedFacets[cat.key] = expandedFacets[cat.key] ?? shouldExpand
        })
    },
    { immediate: true }
)
</script>
<template>
    <aside>
        <OldCategorySidebar
            v-if="isCategory && categoryId"
            :categories="categories"
            :categoryId="categoryId"
        />
        <div class="flex flex-row py-2 px-4 mt-0 mb-4 bg-neutral-100 md:rounded-md items-center justify-between">
            <h5
                class="typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest"
            >
                {{ $t('filters.heading') }}
            </h5>
            <UiUserNavButton
                v-if="filterCount > 0"
                class="w-auto mr-3 text-sm"
                @click="clearFilters"
            >
                <span class="underline mr-1">{{ $t("filters.clearFilters" ) }}</span> ({{ filterCount }})
            </UiUserNavButton>
        </div>
        <div 
            v-if="Object.keys(selectedFacets).length"
            class="flex flex-wrap gap-2 mb-4"
        >
            <template v-for="[facet, values] in Object.entries(selectedFacets)" :key="facet">
                <div 
                    v-for="value in values" 
                    :key="value"
                    class="inline-flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                    {{ $t(`filters.${facet}`) }}: {{ facet === 'categories' ? getCategoryLabel(categories, value) : value }}
                    <button 
                        class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        @click="handleSetFacet(facet, value)"
                    >x</button>
                </div>
            </template>
        </div>
        <div 
            class="h-full overflow-y-auto"
        >
            <div 
                v-if="mergedCategories && !loading && !isCategory"
            >
                <OldFacetCategories
                    :categories="mergedCategories"
                    :showlimit="SHOW_LIMIT"
                    :selectedFacets="selectedFacets"
                    :expandedFacets="expandedFacets"
                    @setFacet="handleSetFacet"
                />
            </div>

            <div 
                v-if="!loading"
                v-for="(facet, index) in visibleFacets"
                :key="index"
            >
                <OldFacetDisplay
                    :facet="facet"
                    :index="index"
                    :showlimit="SHOW_LIMIT"
                    :selectedFacets="selectedFacets"
                    :expandedFacets="expandedFacets"
                    @setFacet="handleSetFacet"
                    :min-price="facetStats?.price?.min || 0"
                    :max-price="facetStats?.price?.max || 0"
                />
            </div>
        </div>
    </aside>
</template>