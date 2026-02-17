<script setup lang="ts">
import { SfIconCheckCircle, SfIconError, SfIconSchedule, SfIconInfo, SfIconWarning } from '@storefront-ui/vue';

const props = defineProps({
    status: {
        type: String, // String as PropType<'draft' | 'waiting' | 'confirmed' | 'assigned' | 'done' | 'cancel'>
        required: true,
    },
    isClickAndCollect: {
        type: Boolean,
        default: false
    }
})

const iconComponent = computed(() => {
  switch (props.status) {
    case 'done':
      return SfIconCheckCircle;
    case 'assigned':
      return props.isClickAndCollect ? SfIconCheckCircle : SfIconInfo;
    case 'waiting':
    case 'confirmed':
    case 'draft':
      return SfIconSchedule;
    case 'cancel':
      return SfIconError;
    default:
      return SfIconWarning;
  }
});

const translationKey = computed(() => {
  if (props.isClickAndCollect) {
    if (props.status === 'assigned') return 'deliveries.section.readyForCollection';
    if (props.status === 'done') return 'deliveries.section.collected';
  }
  return `deliveries.state.${props.status}`;
});

const statusClass = computed(() => {
  switch (props.status) {
    case 'done':
      return '!text-positive-700'; // Green
    case 'assigned':
      return props.isClickAndCollect ? '!text-positive-700' : '!text-primary-700'; // Green if C&C Ready, else Blue
    case 'waiting':
    case 'confirmed':
      return '!text-warning-700'; // Yellow
    case 'draft':
      return '!text-neutral-700'; // Gray
    case 'cancel':
      return '!text-negative-700'; // Red
    default:
      return '!text-neutral-700'; // Gray
  }
});

</script>

<template>
    <UiAlert v-if="props.status" :class="statusClass" class="font-semibold !bg-neutral-100">
    <component :is="iconComponent" class="shrink-0" size="sm"/>
    {{ $t(translationKey) }}
  </UiAlert>
</template>
