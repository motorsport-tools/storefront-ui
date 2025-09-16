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
    if (!facets || !facets['_all_categories']) {
        return categories.value as unknown as menuNode[]
    }
    return mergeFacetCounts(categories.value as unknown as menuNode[], facets['_all_categories'])
})

const expandedFacets = reactive<Record<string, boolean>>({})
const SHOW_LIMIT = 8

const visibleFacets = computed(() => {
    const facets = { ...props.availableFacets }
    if(facets['_all_categories']) {
        delete facets['_all_categories']
    }
    return facets
})

function isCategoryOrChildSelected(cat: menuNode, selected: string[]): boolean {
    if (selected.includes(cat.key)) return true
    if (!cat.children) return false
    return cat.children.some(child => isCategoryOrChildSelected(child, selected))
}

watch(
    () => mergedCategories.value,
    (cats) => {
        if (!cats?.children || !props.selectedFacets) return
        const selected = props.selectedFacets['_all_categories'] ?? []
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
        <div>
            <h4>{{ $t(`filters._all_categories`) }}</h4>
            <div 
                v-if="mergedCategories && !loading"
                v-for="cat in mergedCategories?.children"
                :key="cat.key"
                class="facet-category"
            >
                <label>
                    <input 
                        type="checkbox" 
                        :checked="selectedFacets['_all_categories']?.includes(cat.key)" 
                        @change="setFacet('_all_categories', cat.key)" 
                    />
                    {{ cat.value?.label || cat.key }} ({{ cat.value?.counter ?? 0 }})
                </label>
                <!-- Children -->
                <div 
                    v-if="selectedFacets['_all_categories']?.includes(cat.key)"
                    class="ml-4"
                >
                    <div
                        v-for="sub in cat.children.slice(0, expandedFacets[cat.key] ? cat.children.length : SHOW_LIMIT)"
                        :key="sub.id"
                    >
                        <label>
                            <input
                                type="checkbox"
                                :checked="selectedFacets['_all_categories']?.includes(sub.key)"
                                @change="setFacet('_all_categories', sub.key)"
                            />
                            {{ sub.value.label }} ({{ sub.value.counter || '-'}})
                        </label>
                    </div>
                    <button v-if="cat.children.length > SHOW_LIMIT"
                        @click="expandedFacets[cat.key] = !expandedFacets[cat.key]"
                    >
                        {{ expandedFacets[cat.key] ? 'Show Less' : 'Show More' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="!loading" v-for="(facet, index) in visibleFacets" :key="index">
            <h4>{{ $t(`filters.${index}`) }}</h4>
            <div v-for="val in facet.slice(0, expandedFacets[index] ? facet.length : SHOW_LIMIT)" :key="val.v">
                <label>
                    <input
                        type="checkbox"
                        :checked="selectedFacets[index]?.includes(val.v)"
                        @change="setFacet(index, val.v)"
                    />
                    {{ val.v }} ({{ val.c }})
                </label>
            </div>
            <button v-if="facet.length > SHOW_LIMIT"
                @click="expandedFacets[index] = !expandedFacets[index]"
            >
                {{ expandedFacets[index] ? 'Show Less' : 'Show More' }}
            </button>
        </div>
    </aside>
</template>