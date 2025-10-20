<script setup lang="ts">
import { type PropType, type ConcreteComponent, computed, toRefs } from 'vue'
import { useAttrsRef } from '@storefront-ui/vue'

const props = defineProps({
    tag: {
        type: [String, Object] as PropType<string | ConcreteComponent>,
        default: undefined,
    }
})

const { tag } = toRefs(props)
const attrs = useAttrsRef()


const tagWithDefaults = computed(() => tag?.value || 'button')

const type = computed(
  () =>
    attrs.value.type ??
    (typeof tagWithDefaults.value === 'string' && tagWithDefaults.value.toLowerCase() === 'button'
      ? 'button'
      : undefined),
)
</script>

<template>
    <component
        :is="tagWithDefaults"
        :type="type"
        class="h-full block flex justify-center items-center !text-black hover:bg-transparent !px-2 lg:!px-3 cursor-pointer"
        :class="attrs.class"
    >
        <slot/>
</component>
</template>