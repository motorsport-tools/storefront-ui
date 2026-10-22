<script lang="ts" setup>
import { AisClearRefinements } from 'vue-instantsearch/vue3/es'

const nuxtApp = useNuxtApp()
const serverCanRefine = useState('ais-clear-can-refine', () => false)

const isVisible = (canRefine: boolean) => {
    if (import.meta.server) {
        serverCanRefine.value = canRefine
        return canRefine
    }
    return nuxtApp.isHydrating ? serverCanRefine.value : canRefine
}

</script>
<template>
    <AisClearRefinements>
        <template #default="{ canRefine, refine, createURL }">
            <UiUserNavButton
                class="w-auto mr-3 text-sm"
                :class="{'hidden': !isVisible(canRefine)}"
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