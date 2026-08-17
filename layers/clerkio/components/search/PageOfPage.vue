<script setup lang="ts">
import { AisPagination } from "vue-instantsearch/vue3/es";
</script>
<template>
    <AisPagination>
        <template #default="{currentRefinement, nbPages, pages, isFirstPage, isLastPage, refine, createURL}">
            <span>{{ $t('pageOfPage', { current: currentRefinement + 1, total: nbPages > 0 ? nbPages : 1 }) }}</span>
        </template>
    </AisPagination>
</template>