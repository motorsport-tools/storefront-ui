<script lang="ts" setup>
import { AisRangeInput, AisPanel } from 'vue-instantsearch/vue3/es'

interface Range {
  min: number
  max: number
}

const props = defineProps<{
    label?: string
    attribute: string
}>()

const { attribute } = toRefs(props)

const toValue = (currentValue: Range, boundaries: Range): [number, number] => {
  return [
    typeof currentValue.min === 'number' ? currentValue.min : boundaries.min,
    typeof currentValue.max === 'number' ? currentValue.max : boundaries.max
  ]
}
</script>

<template>
  <AisPanel>
    <template #default="{ hasRefinements }">
      <AisRangeInput
        v-if="hasRefinements" 
        :attribute="attribute"
        :precision="0"
        :step="1"
      >
        <template #default="{ currentRefinement, range, refine }">
          <div class="border rounded-md mb-4">
            <h4 
                class="py-2 px-4 bg-neutral-50 border-b font-bold"
            >
                {{ label ||$t(`filters.${attribute}`) }}
            </h4>
            <div ref="list" class="max-h-[300px] overflow-x-hidden overflow-y-auto">
              <UiRangeSlider
                :model-value="toValue(currentRefinement, range)"
                :min="range.min"
                :max="range.max"
                @update:model-value="refine($event)"
              />
            </div>
          </div> 
        </template>
      </AisRangeInput>
    </template>
  </AisPanel>
</template>

<style scoped>
.slider-labels {
  display: flex;
  justify-content: space-between;
}
</style>