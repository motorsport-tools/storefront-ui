<script setup lang="ts">
import { useStateList } from "~/layers/core/composable/useStateList";

const props = defineProps({
  countryId: {
    type: Number,
    default: 0,
  },
});

const model = defineModel({ default: 0 });

const { loadStates, states } = useStateList(props.countryId);

watch(
  () => props.countryId,
  () => {
    if (props.countryId > 0) {
      loadStates();
    }
  },
  { immediate: true }
);
</script>
<template>
  <label class="md:col-span-3">
    <UiFormLabel>{{ $t("form.stateLabel") }}</UiFormLabel>
    <UiFormCustomSfSelect
      v-model="model"
      name="state"
      autocomplete="state-name"
      required
    >
      <option key="placeholder" :value="null">
        {{ $t("form.selectPlaceholder") }}
      </option>
      <option v-for="state in states" :value="state?.id">
        {{ state.name }}
      </option>
    </UiFormCustomSfSelect>
  </label>
</template>
