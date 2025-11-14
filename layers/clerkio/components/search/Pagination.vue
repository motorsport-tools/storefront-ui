<script setup lang="ts">
import { AisPagination } from "vue-instantsearch/vue3/es";
import { SfIconChevronRight, SfIconChevronLeft, SfButton } from '@storefront-ui/vue';
const props = defineProps({
    maxVisiblePages: {
        type: Number,
        default: 5
    }
})
</script>
<template>
    <AisPagination>
        <template #default="{currentRefinement, nbPages, pages, isFirstPage, isLastPage, refine, createURL}">
            <nav class="flex justify-between items-end border-t border-neutral-200" role="navigation" aria-label="pagination">
                <SfButton
                    type="button"
                    size="lg"
                    class="gap-3"
                    aria-label="Go to previous page"
                    :disabled="isFirstPage"
                    variant="tertiary"
                    @click.prevent="createURL(currentRefinement - 1)"
                >
                    <template #prefix>
                        <SfIconChevronLeft />
                    </template>
                    <span class="hidden sm:inline-flex">Previous</span>
                </SfButton>
                <ul class="flex justify-center">
                    <li v-if="!pages.includes(0)">
                        <div
                            :class="[
                                'flex pt-1 border-t-4 border-transparent',
                                {
                                'font-medium border-t-4 !border-primary-500': currentRefinement === 1,
                                },
                            ]"
                        >
                                <button
                                    type="button"
                                    class="px-4 py-3 md:w-12 rounded-md text-neutral-500 hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900"
                                    :aria-current="currentRefinement === 0"
                                    @click.prevent="refine(0); createURL(0);"
                                >
                                    1
                                </button>
                        </div>
                    </li>
                    <li v-show="pages[0] > 1">
                        <div class="flex pt-1 border-t-4 border-transparent">
                            <button 
                                type="button" 
                                disabled 
                                aria-hidden="true" 
                                class="px-4 py-3 md:w-12 rounded-md text-neutral-500"
                            >
                                ...
                            </button>
                        </div>
                    </li>
                    <li v-for="page in pages" :key="page">
                        <div
                            :class="[
                                'flex pt-1 border-t-4 border-transparent',
                                {
                                'font-medium border-t-4 !border-primary-700': currentRefinement === page,
                                },
                            ]"
                        >
                            <button
                                type="button"
                                :class="[
                                'px-4 py-3 md:w-12 text-neutral-500 rounded-md hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900',
                                {
                                    '!text-neutral-900 hover:!text-primary-800 active:!text-primary-900': currentRefinement === page,
                                },
                                ]"
                                :aria-current="currentRefinement === page"
                                @click.prevent="refine(page); createURL(page);"
                            >
                                {{ page + 1 }}
                            </button>
                        </div>
                    </li>
                    <li v-if="pages[pages.length -1] + 1 < nbPages - 1">
                        <div class="flex pt-1 border-t-4 border-transparent">
                            <button 
                                type="button"
                                disabled
                                aria-hidden="true"
                                class="px-4 py-3 md:w-12 rounded-md text-neutral-500"
                            >
                                ...
                            </button>
                        </div>
                    </li>
                    <li v-if="!pages.includes(nbPages -1) && pages[pages.length -1] > 1">
                        <div
                            :class="[
                                'flex pt-1 border-t-4 border-transparent',
                                {
                                'font-medium border-t-4 !border-primary-500': currentRefinement === nbPages,
                                },
                            ]"
                        >
                            <button
                                type="button"
                                class="px-4 py-3 md:w-12 rounded-md text-neutral-500 hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900"
                                :aria-current="currentRefinement === 0"
                                @click.prevent="refine(nbPages); createURL(nbPages);"
                            >
                                {{ nbPages }}
                            </button>
                        </div>
                    </li>

                </ul>
                <SfButton
                    type="button"
                    size="lg"
                    class="gap-3"
                    aria-label="Go to next page"
                    :disabled="isLastPage"
                    variant="tertiary"
                    @click.prevent="createURL(currentRefinement + 1)"
                >
                    <span class="hidden sm:inline-flex">Next</span>
                    <template #suffix>
                        <SfIconChevronRight />
                    </template>
                </SfButton>
            </nav>
        </template>
    </AisPagination>
</template>