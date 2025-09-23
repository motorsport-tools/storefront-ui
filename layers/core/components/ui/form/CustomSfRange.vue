<script setup lang="ts">
import type { InputHTMLAttributes, PropType } from 'vue'
import { computed, toRefs } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Array, Boolean] as PropType<InputHTMLAttributes>,
    default: false,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number, String,
    default: 0,
    required: false,
  },
  max: {
    type: Number, String,
    default: 999,
    required: false,
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', param: InputHTMLAttributes): void;
}>()

const { modelValue } = toRefs(props)

const proxyChecked = computed({
    get: () => modelValue?.value,
    set: (value) => emit('update:modelValue', value),
})
</script>
<template>
    <div 
        class="price-input relative block flex items-center select-none py-1 px-2 m-1 group w-full"
        :class="[$attrs.class]"
    >
        <span 
            class="price-min absolute left-[1rem]"
        >
            {{ $t('currencySymbol') }}
        </span>
        <label
            class="inline-block"
            for="min"
            :aria-label="$t(`filters.labels.priceMin`)"
        ></label>
        <input 
            class="pl-5 h-10 text-sm inline-block min-w-0 border border-[#cccfdb] rounded"
            type="number"
            name="min"
            inputmode="numeric" 
            :placeholder="$t(`filters.placeholder.min`)"
        />
        <span 
            class="pl-2 text-sm"
        >
        {{ $t(`filters.range.to`) }}
        </span>
        <span 
            class="price-min relative left-[1rem]"
        >
            {{ $t('currencySymbol') }}
        </span>
        <label
            class="inline-block"
            :aria-label="$t(`filters.labels.priceMax`)"
            for="max"
        ></label>
        <input 
            class="pl-5 h-10 text-sm inline-block min-w-0 border border-[#cccfdb] rounded"
            type="number"
            name="max" 
            inputmode="numeric" 
            :placeholder="$t(`filters.placeholder.max`)"
        />
    </div>
</template>
<style lang="css" scoped>
.price-input input[type="number"] {
    appearance: textfield;
}
</style>