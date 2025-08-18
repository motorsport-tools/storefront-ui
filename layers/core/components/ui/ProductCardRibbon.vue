<script setup lang="ts">
import { 
  SfIconSell 
} from '@storefront-ui/vue'

const props = defineProps({
  isNew: {
    type: Boolean,
    default: false,
  },
  isOnSale: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
  },
})

const attrs = useAttrs()

const itemClass = computed(() => [
  `inline-flex items-center justify-center font-medium rounded-none bg-secondary-800 text-${props.size} p-1 gap-1`,
  props.size === 'xs' ? 'p-1' : '',
  props.size === 'sm' ? 'p-1.5' : '',
  props.size === 'md' ? 'p-2' : '',
  props.size === 'lg' ? 'p-2.5' : '',
  props.size === 'xl' ? 'p-3' : '',
])
</script>
<template>
    <div :class="attrs.class || ''">
        <div
          :class="itemClass"
          v-if="isOnSale"
        >
          <SfIconSell
              color="white"
              :size="size"
              class="mr-1"
          />
          <span class="mr-1 text-white">{{ $t(`sale`) }}</span>
        </div>
        
    </div>
</template>