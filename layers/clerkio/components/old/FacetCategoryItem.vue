<script setup lang="ts" name="FacetCategoryItem">
interface Props {
    cat: any
    selectedFacets: Ref<Record<string, string[]>>
}

const props = defineProps<Props>()

const emit = defineEmits(['update'])

</script>
<template>
    <UiFormCustomSfCheckbox
        :key="cat.key"
        :modelValue="selectedFacets['categories']?.includes(cat.key)"
        @update:modelValue="val => emit('update', 'categories', cat.key)"
    >
        <span>{{ cat.value?.label }}</span> <span class="ml-auto text-[0.8em]">({{ cat.value?.counter || 0 }})</span>

        <template #prefix
            v-if="cat.isLeaf && cat.children?.length && selectedFacets['categories']?.includes(cat.key)"
        >
            <div class="ml-4">
                <FacetCategoryItem
                    v-for="child in cat?.children"
                    :key="child.key"
                    :cat="child"
                    :selectedFacets="selectedFacets"
                    @update="(name, value) => emit('update', name, value)" 
                />
            </div>
        </template>
    </UiFormCustomSfCheckbox>
</template>