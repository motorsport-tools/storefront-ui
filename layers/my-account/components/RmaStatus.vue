<script setup lang="ts">
import { SfIconCheckCircle, SfIconError, SfIconSchedule, SfIconInfo, SfIconWarning } from '@storefront-ui/vue';

const props = defineProps({
    status: {
        type: String, // String as PropType<'draft' | 'approved' | 'done' | 'cancel'>
        required: true,
    }
})

const iconComponent = computed(() => {
  switch (props.status) {
    case 'done':
      return SfIconCheckCircle;
    case 'draft':
      return SfIconSchedule;
    case 'approved':
      return SfIconInfo;
    case 'cancel':
      return SfIconError;
    default:
      return SfIconWarning;
  }
});

const translationKey = computed(() => {
  return `rma.state.${props.status}`;
});

const statusClass = computed(() => {
  switch (props.status) {
    case 'done':
      return '!text-positive-700'; // Green
    case 'draft':
      return '!text-warning-700'; // Yellow
    case 'approved':
      return '!text-primary-700'; // Blue
    case 'cancel':
      return '!text-negative-700'; // Red
    default:
      return '!text-neutral-700'; // Gray
  }
});

</script>

<template>
    <UiAlert v-if="props.status" :class="statusClass" class="font-semibold !bg-neutral-100 border border-neutral-200 ml-1">
    <component :is="iconComponent" class="shrink-0" size="sm"/>
    {{ $t(translationKey) }}
  </UiAlert>
</template>
