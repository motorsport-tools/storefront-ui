<script setup lang="ts">

</script>
<template>
    <div
        class="product_card relative hover:shadow-lg min-h-[330px] flex flex-col justify-around min-w-[190px] max-w-[250px] m-auto mb-6"
    > 
        <div class="relative w-full h-full max-h-[250px] aspect-square">
            <UiSkeletonLoader class="flex justify-center items-center w-full max-h-[250px] h-fit aspect-square"/>
        </div>
        <div
            class="p-2 border-t border-neutral-200 typography-text-sm flex flex-col justify-between gap-1 h-full"
        >
            <div class="self-start w-full">
                <span class="product_card__brand">
                    <UiSkeletonLoader class="h-3 w-10"/>
                </span>
                <span class="product_card__title block pb-1 border-b border-neutral-200">
                    <UiSkeletonLoader class="h-2 mb-1"/>
                    <UiSkeletonLoader class="h-2"/>
                </span>
            </div>
            <div class="flex items-center mb-2">
                <UiSkeletonLoader class="w-[150px] h-[18px]"/>
            </div>
            <div class="flex justify-between">
                <div class="block">
                    <UiSkeletonLoader class="h-[1.5em] w-20"/>
                </div>
                <UiSkeletonLoader class="h-[1.5em] w-20"/>
            </div>
        </div>
    </div>
</template>
<style>

</style>