<script setup lang="ts">
    import { SfButton } from '@storefront-ui/vue';
interface Props {
    blockData: Object
}

const NuxtLink = resolveComponent("NuxtLink");

const props = defineProps<Props>()
</script>
<template>
    <SfButton
        :tag="NuxtLink"
        :title="blockData?.title"
        :to="blockData?.link"
        :target="blockData?.target"
        class="bg-white !text-black text-lg !grow-0 hover:!bg-neutral-200 !flex-none !w-auto"
    >
        {{ blockData?.title }}
    </SfButton>
</template>