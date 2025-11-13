<script lang="ts" setup>
import { AisHierarchicalMenu } from 'vue-instantsearch/vue3/es'
import { SfIconChevronRight } from '@storefront-ui/vue';

type SortingOrder = 'isRefined' | 'count' | 'name'

const props = defineProps<{
  label?: string
  attributes: string[]
  initialSortBy: SortingOrder
  separator: string
  showParentLevel: boolean
  showMore?: boolean
  limit?: number
  rootPath?: string
}>()

const sortingOrder = ref<SortingOrder>(props.initialSortBy)
const sortBy = computed(() => {
  return [
    'isRefined',
    sortingOrder.value
  ]
})
</script>
<template>
    <div class="mb-4 mb-5">
        <AisHierarchicalMenu
            :attributes="props.attributes"
            :separator="props.separator"
            :show-parent-level="props.showParentLevel"
            :root-path="props.rootPath"
            :sort-by="sortBy"
        >
            <template #default="{ items, canToggleShowMore, isShowingMore, refine, toggleShowMore, createURL, sendEvent }"
            >
                <div ref="list" class="py-1 px-2 mx-1 my-1">
                    <div>
                        <SearchHierarchicalMenuList
                            :items="items"
                            :refine="refine"
                            :createURL="createURL"
                            :level="0"
                        />
                    </div>
                </div>
                <div 
                    v-show="canToggleShowMore"
                    class="py-2 px-4 text-sm text-primary-700"
                >
                    <button
                        @click.prevent="toggleShowMore"
                    >
                        <SfIconChevronRight
                            :class="[isShowingMore ? '-rotate-90' : 'rotate-90', 'transition-transform']"
                        />
                        {{ !isShowingMore ? $t('filters.showMore') : $t('filters.showLess') }}
                    </button>
                </div>
            </template>
        </AisHierarchicalMenu>
    </div>
</template>