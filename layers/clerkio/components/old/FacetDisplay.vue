<script setup lang="ts">
import {
    SfIconChevronRight
} from "@storefront-ui/vue"
import {
    facetShowToggle
} from "../../utils"
const emit = defineEmits(["setFacet"])

interface Props {
    facet: any
    index: any
    showlimit: number
    selectedFacets: Ref<Record<string, string[]>>
    expandedFacets: Record<string, boolean>
    minPrice: number
    maxPrice: number
}

const props = defineProps<Props>()

const handleChange = (key: string, value: string | number | boolean) => {
    emit("setFacet", key, value)
}

const maxRef = ref(props.maxPrice)
const minRef = ref(props.minPrice)

const list = ref<HTMLDivElement | null>(null)

let type:string = ''
let show:boolean = false
if( props.index === 'has_stock' || props.index === 'on_sale' ) {
    type = 'boolean'
    show = true
} else if( props.index === 'price' ) {
    type = 'range'
    if(props.maxPrice) {
        show = true
    }
} else {
    show = true
}

</script>
<template>
    <div 
        v-if="show"
        class="border rounded-md mb-4"
    >
        <h4 
            class="py-2 px-4 bg-neutral-50 border-b font-bold"
        >
            {{ $t(`filters.${index}`) }}
        </h4>
        <div ref="list" class="max-h-[300px] overflow-x-hidden overflow-y-auto">
            <UiFormCustomSfToggle
                v-if="type === 'boolean'"
                :model-value="Boolean(selectedFacets[index])"
                @update:model-value="handleChange(index, !Boolean(selectedFacets[index]))"
            >
                <span class="ml-2 text-sm">{{ $t(`filters.labels.${index}`) }}</span>
            </UiFormCustomSfToggle>
            <UiFormCustomSfRange
                v-else-if="type === 'range'"
                :min="minPrice"
                :max="maxPrice"
                v-model:min-value="minRef"
                v-model:max-value="maxRef"
            />
            <UiFormCustomSfCheckbox
                v-else
                v-for="val, i in facet.slice().sort((a, b) => a.v.localeCompare(b.v))"
                :key="val.v"
                :class="{ hidden: i >= showlimit && !expandedFacets[index] }"
                :modelValue="selectedFacets[index]?.includes(val.v)"
                @update:modelValue="handleChange(index, val.v)"
            >
                <span>{{ val.v }}</span> <span class="ml-auto text-[0.8em]">({{ val.c }})</span>
            </UiFormCustomSfCheckbox>
        </div>
        <div 
            v-if="facet.length > showlimit && type !== 'range'"
            class="py-2 px-4 text-sm text-primary-700"
        >
            <button 
                @click="facetShowToggle(list, expandedFacets, index)"
            >
                <SfIconChevronRight
                    :class="[expandedFacets[index] ? '-rotate-90' : 'rotate-90', 'transition-transform']"
                />
                {{ expandedFacets[index] ? $t('filters.showLess') : $t('filters.showMore') }}
            </button>
        </div>
    </div>
</template>