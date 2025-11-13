<script lang="ts" setup>
import { AisHitsPerPage } from 'vue-instantsearch/vue3/es'
import { createWidgetMixin } from 'vue-instantsearch/vue3/es'
const props = defineProps<{
  options: Array<{
    value: string | number | boolean;
    label: string;
    default?: boolean;
  }>;
  hitsPerPage?: string | number;
}>()
const { options } = toRefs(props);
</script>
<template>
    <AisHitsPerPage
        :items="options"
        :class="$attrs.class"
    >
        <template #default="{ items, refine }">
            
            <UiFormCustomSfSelect
                :model-value="items.find(i => i.isRefined)?.value ?? null"
                @update:modelValue="refine"
            >
                <option
                    v-for="option in items"
                    :key="option.value"
                    :value="option.value"
                    :selected="option.isRefined"
                >
                    {{$t('show') }}: {{ option.label }}
                </option>
            </UiFormCustomSfSelect>
        </template>
    </AisHitsPerPage>
    <span class="text-[12px]">
        {{ $t('productsPerPage') }}
    </span>
</template>