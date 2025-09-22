<script setup lang="ts">
import type { InputHTMLAttributes, PropType } from 'vue'
import { computed, toRefs } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Array, Boolean] as PropType<InputHTMLAttributes['checked']>,
    default: false,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', param: InputHTMLAttributes['checked']): void;
}>()

const { modelValue } = toRefs(props)

const proxyChecked = computed({
    get: () => modelValue?.value,
    set: (value) => emit('update:modelValue', value),
})
</script>
<template>
    <label 
        class="switch relative inline-block flex flex-row items-center select-none cursor-pointer py-1 px-2 m-1 group"
        :class="[$attrs.class]"
    >
        <input 
            type="checkbox"
            v-model="proxyChecked"
            class="absolute w-0 h-0 invisible peer"
            data-testid="checkbox"
        >
        <span 
            class="slider box-border w-[3.5em] h-[2em] relative cursor-pointer top-0 left-0 right-0 bottom-0 bg-white border border-[#adb5bd] rounded-[30px] before:content-[''] before:absolute before:h-[1.4em] before:w-[1.4em] before:rounded[20px] before:left-[0.27em] before:bottom-[0.27em] before:bg-[#adb5bd] before:duration-[.4s] before:rounded-[20px] peer-checked:bg-blue-700 peer-checked:border-blue-700 peer-checked:before:[transform:translateX(1.4em)] peer-checked:before:bg-white peer-focus:shadow-[0_0_1px_#007bff] group-hover:shadow-[0_0_1px_#007bff]"
        ></span>
        <slot></slot>
    </label>
</template>