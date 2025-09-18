<script setup lang="ts">
import type { Category } from '~/graphql'
import type { Node as menuNode } from '#layers/header/types'

const router = useRouter()
const emit = defineEmits(["close"]);

interface Props {
    selectedFacets: Ref<Record<string, string[]>>
    availableFacets: Ref<ClerkFacets>
    setFacet: (key: string, value: string | number | boolean) => void
    filterCount: number
    loading: boolean
}

const props = defineProps<Props>()

const clearFilters = () => {
    props.selectedFacets.value = {};
    router.push({ query: {} });
    emit("close");
}

const categoriesForMegaMenu = inject<Ref<Category[]> | undefined>('categoriesForMegaMenu')

const categories = computed(() => categoriesForMegaMenu?.value ?? [])

interface ClerkFacetValue {
    v: string
    c: number
}

function mergeFacetCounts(menuNode: menuNode, facetValues: ClerkFacetValue[]): menuNode {
    const mergedNode: menuNode = { ...menuNode }

    const countEntry = facetValues.find(f => f.v === mergedNode.key)

    if (countEntry) {
        mergedNode.value.counter = countEntry.c
    }

    // Recurse into children if any
    if (mergedNode.children?.length) {
        mergedNode.children = mergedNode.children.map(child => mergeFacetCounts(child, facetValues))
    }

    return mergedNode
}

const mergedCategories = computed(() => {
    if (!props.availableFacets) return categories.value
    const facets = props.availableFacets
    if (!facets || !facets['categories']) {
        return categories.value as unknown as menuNode[]
    }
    return mergeFacetCounts(categories.value as unknown as menuNode[], facets['categories'])
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

function isCategoryOrChildSelected(cat: menuNode, selected: string[]): boolean {
    if (selected.includes(cat.key)) return true
    if (!cat.children) return false
    return cat.children.some(child => isCategoryOrChildSelected(child, selected))
}

const handleSetFacet = (key: string, value: string | number | boolean) => {
    props.setFacet(key, value)

    if(key === 'categories') {
        const loop = (nodes) => {
            for (const cat of nodes) {
                if (cat.key === value) {
                    // If it has children, recurse
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
                    return // done after finding the category
                }
                // Recurse into other branches
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
    <aside >
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
            class="h-full overflow-y-auto"
        >
            <div 
                v-if="mergedCategories && !loading"
            >
                <FacetCategories
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
                <FacetDisplay
                    :facet="facet"
                    :index="index"
                    :showlimit="SHOW_LIMIT"
                    :selectedFacets="selectedFacets"
                    :expandedFacets="expandedFacets"
                    @setFacet="handleSetFacet"
                />
            </div>
        </div>
    </aside>
</template>