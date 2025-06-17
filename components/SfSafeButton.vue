<script setup>
import { h, useSlots } from 'vue'
import SfButton from '@storefront-ui/vue/dist/components/SfButton'

const props = defineProps()
const attrs = useAttrs()
const slots = useSlots()

try {
  console.log('🟢 SafeSfButton rendering SSR...')
} catch (err) {
  console.error('🔴 Error in SafeSfButton (sync):', err)
}

</script>

<template>
  <SfButton v-bind="props" v-bind="attrs" v-on="$attrs">
    <template v-for="(_, name) in slots" #[name]="slotProps">
      <component :is="slots[name]" v-bind="slotProps" />
    </template>
  </SfButton>
</template>