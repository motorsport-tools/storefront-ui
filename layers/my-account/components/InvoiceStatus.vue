<script setup lang="ts">
import { SfIconCheckCircle, SfIconError, SfIconSchedule, SfIconInfo, SfIconWarning } from '@storefront-ui/vue';

const props = defineProps({
    status: {
        type: String as PropType<'not_paid' | 'in_payment' | 'paid' | 'partial' | 'reversed'>,
        required: true,
    }
})

const iconComponent = computed(() => {
  switch (props.status) {
    case 'paid':
      return SfIconCheckCircle;
    case 'not_paid':
      return SfIconWarning;
    case 'in_payment':
      return SfIconSchedule;
    case 'partial':
      return SfIconInfo;
    case 'reversed':
      return SfIconError;
    default:
      return SfIconWarning;
  }
});

const translationKey = computed(() => {
  switch (props.status) {
    case 'paid':
      return 'account.myOrders.lastInvoices.state.paid';
    case 'not_paid':
      return 'account.myOrders.lastInvoices.state.notPaid';
    case 'in_payment':
      return 'account.myOrders.lastInvoices.state.inPayment';
    case 'partial':
      return 'account.myOrders.lastInvoices.state.partial';
    case 'reversed':
      return 'account.myOrders.lastInvoices.state.reversed';
    default:
    return 'account.myOrders.lastInvoices.state.notPaid';
  }
});

const statusClass = computed(() => {
  switch (props.status) {
    case 'paid':
      return '!text-positive-700'; // Green
    case 'not_paid':
      return '!text-negative-700'; // Red
    case 'in_payment':
      return '!text-warning-700'; // Yellow
    case 'partial':
      return '!text-primary-700'; // Blue
    case 'reversed':
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