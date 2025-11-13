<script lang="ts" setup>
import { AisClearRefinements } from 'vue-instantsearch/vue3/es'
</script>
<template>
    <AisClearRefinements>
        <template #default="{ canRefine, refine, createURL }">
            <UiUserNavButton
                class="w-auto mr-3 text-sm"
                :class="{'hidden': !canRefine}"
                tag="button"
                @click.prevent="refine"
            >
                <span class="underline mr-1">
                    {{ $t("filters.clearFilters" ) }}
                </span>
            </UiUserNavButton>
        </template>
    </AisClearRefinements>
</template>