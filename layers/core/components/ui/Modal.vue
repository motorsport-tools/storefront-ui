<script setup lang="ts">
import { SfModal } from "@storefront-ui/vue";

const props = defineProps<{
  tag?: string;
  disableClickAway?: boolean;
  disableEsc?: boolean;
}>();
</script>

<template>
  <SfModal
    class="md:max-h-[min(calc(100vh-32px),100%)]"
    v-bind="{ ...$attrs, ...props }"
  >
    <slot />
  </SfModal>
</template>
