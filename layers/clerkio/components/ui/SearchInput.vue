<script lang="ts" setup>
interface Props {
  value: string
  placeholder?: string
  hasImage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  value: '',
  hasImage: false
})

defineEmits(['input', 'reset'])

const placeholder = toRef(props, 'placeholder')
const slots = useSlots()
const hasRightSlot = computed(() => !!slots.right)
const hasLeftSlot = computed(() => !!slots.left && props.hasImage)
const shouldShowReset = computed(() => !!props.value || props.hasImage)
</script>

<template>
  <form class="flex relative w-full h-11">
    <!-- Left slot for custom content (like image preview) -->
    <div
      v-if="hasLeftSlot"
      class="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center"
    >
      <slot name="left"></slot>
    </div>

    <!-- Search icon -->
    <div
      class="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-ashes-600 pointer-events-none z-10"
      :style="hasLeftSlot ? 'left: calc(var(--left-slot-width, 36px) + 10px)' : 'left: 1rem'"
    >
      <UiIconSearch/>
    </div>

    <input
      type="search"
      :placeholder="placeholder"
      :value="value"
      class="flex-1 max-w-full py-3 rounded-lg bg-white border border-ashes-900 text-valhalla-300 text-sm font-sans appearance-none transition-colors duration-300 placeholder:text-ashes-900 hover:border-dodger-blue-500 focus:border-dodger-blue-500 focus:ring-4 focus:ring-dodger-blue-500/20 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      :style="hasLeftSlot ? 'padding-left: calc(var(--left-slot-width, 36px) + 30px)' : 'padding-left: 2.5rem'"
      style="padding-right: 2rem;"
      @input="$emit('input', $event)"
    >

    <button
      v-show="shouldShowReset"
      type="reset"
      class="absolute flex items-center justify-center w-5 h-5 rounded-full top-1/2 -translate-y-1/2 cursor-pointer bg-transparent border-none text-ashes-900 hover:text-valhalla-100 focus:outline-none focus-visible:text-valhalla-100 transition-colors duration-300"
      :class="{ 'right-14': hasRightSlot, 'right-4': !hasRightSlot }"
      @click="$emit('reset')"
    >
      <UiIconX class="w-4 h-4" />
    </button>

    <!-- Right slot for custom buttons -->
    <div v-if="slots.right" class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
      <slot name="right"></slot>
    </div>
  </form>
</template>