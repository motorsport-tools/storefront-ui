<script setup lang="ts">
import { SfIconCheckCircle, SfIconError, SfIconSchedule, SfIconInfo, SfIconWarning } from '@storefront-ui/vue';

const props = defineProps({
    status: {
        type: String,
        required: true,
    },
    isClickAndCollect: {
        type: Boolean,
        default: false
    }
})

const iconComponent = computed(() => {
  switch (props.status) {
    case 'Done':
      return SfIconCheckCircle;
    case 'Assigned':
      return props.isClickAndCollect ? SfIconCheckCircle : SfIconInfo;
    case 'Waiting':
    case 'Confirmed':
    case 'Draft':
      return SfIconSchedule;
    case 'Cancel':
      return SfIconError;
    default:
      return SfIconWarning;
  }
});

const translationKey = computed(() => {
  if (props.isClickAndCollect) {
    if (props.status === 'Assigned') return 'deliveries.section.readyForCollection';
    if (props.status === 'Done') return 'deliveries.section.collected';
  }
  return `deliveries.state.${props.status}`;
});

const statusClass = computed(() => {
  switch (props.status) {
    case 'Done':
      return '!text-positive-700'; // Green
    case 'Assigned':
      return props.isClickAndCollect ? '!text-positive-700' : '!text-primary-700'; // Green if C&C Ready, else Blue
    case 'Waiting':
    case 'Confirmed':
      return '!text-warning-700'; // Yellow
    case 'Draft':
      return '!text-neutral-700'; // Gray
    case 'Cancel':
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
