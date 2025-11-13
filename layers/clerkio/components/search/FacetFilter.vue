<script lang="ts" setup>
import { SfIconChevronRight } from '@storefront-ui/vue'
import { AisRefinementList } from 'vue-instantsearch/vue3/es'

type SortingOrder = 'isRefined' | 'count' | 'name'

const props = defineProps<{
  label?: string
  attribute: string
  initialSortBy: SortingOrder
  searchable?: boolean
  sortable?: boolean
  showMore?:boolean
  showMoreLimit?:number
}>()

const searchInput = ref<string>('')
const sortingOrder = ref<SortingOrder>(props.initialSortBy)

const refineFacet = (searchFn: any, inputValue: string) => {
  searchInput.value = inputValue
  searchFn(inputValue)
}

const sortingOptions: Array<{value: SortingOrder, label: string}> = [
  { value: 'count', label: 'By count' },
  { value: 'name', label: 'By name' }
]

const sortBy = computed(() => {
  return [
    'isRefined',
    sortingOrder.value
  ]
})

const showLimit  = computed(() => {
    return props.showMoreLimit || 100
})

const filterOutEmptyFacets = (items: any) => {
  return items.filter((item: any) => item.count > 0)
}
</script>

<template>
    <div class="border rounded-md mb-4">
        <h4 
            class="py-2 px-4 bg-neutral-50 border-b font-bold"
        >
            {{ label }}
        </h4>
        <AisRefinementList
            :attribute="props.attribute"
            :searchable="props.searchable || false"
            :show-more="props.showMore || false"
            :show-more-limit="showLimit"
            :sort-by="sortBy"
            operator="or"
        >
            <template
            #default="{ items, refine, searchForItems, isFromSearch, isShowingMore, canToggleShowMore, toggleShowMore }"
            >
                <div ref="list" class="py-1 px-2 mx-1 my-1">
                        <div
                            v-if="sortable" 
                            class="flex items-baseline"
                        >
                            <UiFormCustomSfSelect
                                v-model="sortingOrder"
                                wrapperClassName="ml-auto"
                            >
                                <option
                                    v-for="option in sortingOptions"
                                    :key="option.value"
                                    :value="option.value"
                                    :selected="props.initialSortBy === option.value"
                                >
                                    {{ option.label }}
                                </option>
                            </UiFormCustomSfSelect>
                        </div>
                        <div
                            v-if="searchable"
                            class="py-1 px-2 mx-1 my-1"
                        >
                            <UiSearchInput
                                class="mb-3"
                                :placeholder="$t('search') +' '+ $t(`filters.${attribute}Plural`)"
                                :value="searchInput"
                                @input="refineFacet(searchForItems, $event.target.value)"
                                @reset="refineFacet(searchForItems, '')"
                            />
                        </div>

                        <div class="max-h-[360px] overflow-x-hidden overflow-y-auto ">
                            <div
                                v-if="isFromSearch && !items.length"
                                class="py-1 px-2 mx-1 my-1"
                            >
                                <p>{{ $t('noResults') }}</p>
                            </div>
                            <UiFormCustomSfCheckbox
                                v-for="item in filterOutEmptyFacets(items)"
                                :disabled="item.count === 0"
                                :key="item.value"
                                :modelValue="item.isRefined"
                                :name="item.value"
                                @update:modelValue="refine(item.value)"
                            >
                                <span>{{ item.label }}</span> 
                                <span v-if="item.count" 
                                    class="ml-auto text-[0.8em]"
                                >
                                    ({{ item.count.toLocaleString() }})
                                </span>
                            </UiFormCustomSfCheckbox>
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
        </AisRefinementList>
    </div>
</template>