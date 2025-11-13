<script lang="ts" setup>
import { AisSortBy } from "vue-instantsearch/vue3/es";

const props = defineProps<{
options: Array<{
    value: number | string | boolean;
    label: string;
}>;
}>();

const { options } = toRefs(props);
</script>

<template>
  <AisSortBy 
    :items="options"
    :class="$attrs.class"
>
    <template #default="{ items, currentRefinement, refine }">
        <component :is="HitsPerPageTracker"/>
        <UiFormCustomSfSelect
            :modelValue="currentRefinement"
            @update:modelValue="refine"
        >
            <option
                v-for="option in items"
                :key="option.value"
                :value="option.value"
                :selected="currentRefinement === option.value"
            >
                {{$t('sortBy') }}: {{ option.label }}
            </option>
        </UiFormCustomSfSelect>
    </template>
  </AisSortBy>
</template>