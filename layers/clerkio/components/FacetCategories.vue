<script setup lang="ts">
import FacetCategoryItem from "./FacetCategoryItem.vue"
const emit = defineEmits(["setFacet"])

interface Props {
    categories: any
    selectedFacets: Ref<Record<string, string[]>>
}

const props = defineProps<Props>()
const list = ref<HTMLDivElement | null>(null)

const handleChange = (key: string, value: string | number | boolean) => {
    emit("setFacet", key, value)
}
</script>
<template>
    <div class="border rounded-md mb-4">
        <h4
            class="py-2 px-4 bg-neutral-50 border-b font-bold"
        >
            {{ $t(`filters._all_categories`) }}
        </h4>
        <div ref="list" class="max-h-[300px] overflow-y-auto">
            <FacetCategoryItem
                v-for="child in categories?.children"
                :key="child.key"
                :cat="child"
                :selectedFacets="selectedFacets"
                @update="handleChange"
            />
            
        </div>
        
    </div>
</template>