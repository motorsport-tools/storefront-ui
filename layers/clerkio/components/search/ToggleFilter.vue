<script setup lang="ts">
import { AisToggleRefinement } from 'vue-instantsearch/vue3/es'

const props = defineProps<{
  label?: string
  attribute: string
}>()

</script>
<template>
    <div class="border rounded-md mb-4">
        <h4 
            class="py-2 px-4 bg-neutral-50 border-b font-bold"
        >
            {{ $t(`filters.${attribute}`) }}
        </h4>
        <div ref="list" class="max-h-[300px] overflow-x-hidden overflow-y-auto">
            <AisToggleRefinement
                :attribute="$props.attribute"
            >
                <template
                #default="{ value, refine, createURL, sendEvent }"
                >
                    <label 
                        class="switch relative inline-block flex flex-row items-center select-none cursor-pointer py-1 px-2 m-1 group"
                    >
                        <input 
                            type="checkbox"
                            :checked="value.isRefined"
                            class="absolute w-0 h-0 invisible peer"
                            data-testid="checkbox"
                            @click="refine(value)"
                        >
                        <span 
                            class="slider box-border inline-block !w-[3.5em] shrink-0 h-[2em] relative cursor-pointer top-0 left-0 right-0 bottom-0 bg-white border border-[#adb5bd] rounded-[30px] before:content-[''] before:absolute before:h-[1.4em] before:w-[1.4em] before:rounded[20px] before:left-[0.27em] before:bottom-[0.27em] before:bg-[#adb5bd] before:duration-[.4s] before:rounded-[20px] peer-checked:bg-blue-700 peer-checked:border-blue-700 peer-checked:before:[transform:translateX(1.4em)] peer-checked:before:bg-white peer-focus:shadow-[0_0_1px_#007bff] group-hover:shadow-[0_0_1px_#007bff]"
                        ></span>
                        <span class="w-full text-sm ml-2 flex">
                            <span class="ml-2">{{ $t(`filters.labels.${attribute}`) }}</span>
                            <span class="ml-auto text-[0.8em]">
                                ({{ value.count }})</span>
                        </span>
                    </label>
                </template>
            </AisToggleRefinement>
        </div>
    </div>
</template>