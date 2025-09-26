<script setup lang="ts">
import type { Node as menuNode } from '#layers/header/types'
import { findCategoryNode, findParentNode } from '../utils/categories'

interface Props {
    categories: menuNode[],
    categoryId: string
}

const props = defineProps<Props>()

const node = computed(() => { 
    if(props.categories.children.length > 0 && props.categoryId) {
        return findCategoryNode(props.categories.children, props.categoryId)
    } 
    return []
})

const parent = computed(() => {
    if(props.categories.children.length > 0 && props.categoryId) {
        return findParentNode(props.categories, props.categoryId)
    }  
    return undefined
})
</script>
<template v-if="categories && categoryId">
    <div 
        class="flex flex-row py-2 px-4 mt-0 mb-4 bg-neutral-100 md:rounded-md items-center justify-between">
        <h5
            class="typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest"
        >
            {{ $t('categories.heading') }}
        </h5>
    </div>
    <div 
        class="flex flex-wrap gap-2 mb-4"
    >
        <NuxtLink
            v-if="parent"
            :to="parent?.value.link"
            class="px-2"
        >
            {{ parent.value.label }}
        </NuxtLink>
        <ul
            v-if="node && node.children.length > 0"
            class="px-2"
        >
            <li 
                v-for="item in node.children"
                :key="item.key"
                class="mx-1 my-1 py-1 px-2 text-sm"
            >
                <NuxtLink
                    :to="item.value.link"
                >
                    {{ item.value.label }}
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>