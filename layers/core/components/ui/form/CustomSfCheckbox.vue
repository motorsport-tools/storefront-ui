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
  disabled: {
    type: Boolean,
    required: false,
  }
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
        class="customCheck flex flex-row items-center select-none cursor-pointer py-1 px-2 rounded-md overflow-hidden transition-all ease-in-out hover:bg-neutral-100 group mx-1 my-1"
        :class="[$attrs.class]"
    >
        <input
            v-model="proxyChecked"
            type="checkbox"
            class="absolute invisible peer"
            data-testid="checkbox"
        />
        <span class="[transform:translate3d(0,0,0)] relative size-[18px] border border-[#cccfdb] group-hover:border-blue-700 rounded-sm transition-all ease-in-out shadow-[0_1px_1px_rgba(0,16,75,0.05)] peer-checked:bg-blue-700 peer-checked:animate-wave">
            <svg 
                width="12px"
                height="10px"
                class="absolute top-[3px] left-[2px] stroke-white fill-none stroke-2"
            >
                <use xlink:href="#check-4"></use>
            </svg>
        </span>
        <span
            class="text-sm ml-2 flex w-full"
        >
            <slot></slot>
        </span>
    </label>
    <slot name="prefix">
        
    </slot>
</template>
<style>
.customCheck svg {
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 16px;
    stroke-dashoffset: 16px;
    transition: all 0.3s ease;
    transition-delay: 0.1s;
    transform: translate3d(0, 0, 0);
}
label.customCheck:has(:checked) span svg {
    stroke-dashoffset: 0;
}
</style>
