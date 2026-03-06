<script setup lang="ts">
import type { Ribbon } from '~/graphql'
import { 
  SfIconSell,
  SfIconBlock,
  SfIconRadioButtonChecked,
  
} from '@storefront-ui/vue'

const props = defineProps({
  ribbon: {
    type: Object as PropType<Ribbon> | null,
  },
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
  },
})

const attrs = useAttrs()

const itemClass = computed(() => [
  `inline-flex items-center justify-center font-medium rounded-none text-${props.size} p-1 gap-1`,
  props.size === 'xs' ? 'p-1' : '',
  props.size === 'sm' ? 'p-1.5' : '',
  props.size === 'md' ? 'p-2' : '',
  props.size === 'lg' ? 'p-2.5' : '',
  props.size === 'xl' ? 'p-3' : '',
])

const icon = computed(() => {
  if(props.ribbon?.id == 1) {
    return SfIconSell
  }
  if(props.ribbon?.id == 3) {
    return SfIconBlock
  }
  if(props.ribbon?.id == 4) {
    return SfIconRadioButtonChecked
  }
})
</script>
<template>
    <div 
      v-if="ribbon"
      :class="attrs.class || ''"
    >
      <div
        :class="itemClass"
        :style="{ backgroundColor: ribbon.bgColor || '', color: ribbon.textColor || '' }"
      >
        <component :is="icon" :size="size || 'base'" class="mr-1"/>
        {{ ribbon.html }}
      </div>
    </div>
</template>