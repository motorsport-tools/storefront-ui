<script lang="ts" setup>
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'
import 'vue-slider-component/theme/default.css'

const { $i18n } = useNuxtApp()

const props = defineProps<{
  modelValue: [number, number]
  min: number
  max: number
}>()

defineEmits<{
 (e: 'update:model-value', value: [number, number]): void
}>()

const { modelValue, min, max } = toRefs(props)

const formatTooltip = (value: number) => {
    let x = $i18n.t('currencySymbol')

    return x + `${value}`
}
</script>

<template>
    <div
        class="price-input relative block flex flex-col items-center select-none py-1 px-2 m-1 group w-auto"
        :class="[$attrs.class]"
    >   
        <div
            class="flex flex-row items-center justify-center w-full"
        >
            <span 
                class="price-min relative left-[1rem]"
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
                min="0"
                v-model="modelValue[0]"
                :placeholder="$t(`filters.placeholder.min`)"
                :disabled="min === max"
                @change="$emit('update:model-value', ({ min: modelValue[0], max: modelValue[1] }))"
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
                min="1"
                v-model="modelValue[1]"
                :placeholder="$t(`filters.placeholder.max`)"
                :disabled="min === max"
                @change="$emit('update:model-value', ({ min: modelValue[0], max: modelValue[1] }))"
            />
        </div>
        <div class="range-slider relative w-full my-4 px-3">
            <VueSlider
                :model-value="modelValue"
                :min="min"
                :max="max"
                :lazy="true"
                :dotSize="20"
                class="body"
                tooltip="hover"
                :tooltip-style="{
                    background: 'var(--ashes-600)',
                    borderColor : 'var(--ashes-600)',
                    color: 'var(--colors-black)',
                    padding: '0.6em'
                }"
                :process-style="{ background: 'var(--dodger-blue-500)' }"
                :tooltip-formatter="formatTooltip"
                @change="$emit('update:model-value', ({ min: $event[0], max: $event[1] }))"
            />
        </div>
    </div>
</template>