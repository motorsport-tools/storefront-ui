<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps({
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
  minValue: {
    type: Number,
    default: 0,
  },
  maxValue: {
    type: Number,
    default: 99999,
  },
})

const emit = defineEmits(["update:minValue", "update:maxValue"])

const slider = ref(null)
const progress = ref<HTMLElement | null>(null)
const minValue = ref(props.minValue)
const maxValue = ref(props.maxValue)
const step = computed( () => { return getStep(props.min, props.max) || 0.01 } )

const getStep = (min: number, max: number) => {
    const range = max - min
    if (range < 20) return 0.01
    if (range < 100) return 0.1
    if (range < 1000) return 1
    return 10
}

const setCss = () => {
    if(progress.value) {
        const range = props.max - props.min

        const minClamped = Math.max(props.min, Math.min(minValue.value, props.max))
        const maxClamped = Math.max(props.min, Math.min(maxValue.value, props.max))

        const left = Math.round(((minClamped - props.min) / range) * 100 * 100) / 100
        const right = Math.round((100 - ((maxClamped - props.min) / range) * 100) * 100) / 100
        const width = range == 0 ? 100 : Math.round(((maxClamped - minClamped) / range) * 100 * 100) / 100

        progress.value.style.left = `${left}%`
        progress.value.style.right = `${right}%`
        progress.value.style.width = `${width}%`
    }
}

const handleMinChange = ({ target }: Event & { target: HTMLInputElement }) => {
    minValue.value = parseFloat(target.value)
    emit("update:minValue", minValue.value)
    setCss()
}

const handleMaxChange = ({ target }: Event & { target: HTMLInputElement }) => {
    maxValue.value = parseFloat(target.value)
    emit("update:maxValue", maxValue.value)
    setCss()
}
onMounted( () => {
    setCss()
})
watch( () => props.max, max => {
    if(maxValue.value > max) {
        setTimeout(() => { maxValue.value = max },10)
    } else {
        maxValue.value = max
    }
    setCss()
})

watch(() => props.min, min => {
    minValue.value = min
    setCss()
})
</script>
<template>
    <div
        class="price-input relative block flex flex-col items-center select-none py-1 px-2 m-1 group w-auto"
        :class="[$attrs.class]"
    >
        <div
            class="flex flex-row items-center w-full"
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
                v-model="minValue"
                :placeholder="$t(`filters.placeholder.min`)"
                @change="handleMinChange"
                :disabled="min === max"
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
                v-model="maxValue"
                :placeholder="$t(`filters.placeholder.max`)"
                @change="handleMaxChange"
                :disabled="min === max"
            />
        </div>
        <div ref="slider" class="range-slider relative w-full h-[5px] my-4 bg-neutral-300">
            <div ref="progress" class="progress w-full mx-auto absolute left-[0%] right-[100%] h-full rounded bg-blue-700"></div>
            <input 
                type="range"
                class="absolute pointer-events-none w-full h-[5px]"
                name="min"
                :min="min"
                :max="max"
                :value="minValue"
                :step="step"
                data-testid="range"
                @input="handleMinChange"
                :disabled="min === max"
            />
            <input
                type="range"
                class="absolute pointer-events-none w-full h-[5px]"
                name="max"
                :min="min"
                :max="max"
                :value="maxValue"
                :step="step"
                data-testid="range"
                @input="handleMaxChange"
                :disabled="min === max"
            />
        </div>
    </div>
</template>
<style lang="css" scoped>
.price-input input[type="number"] {
    appearance: textfield;
}

.range-slider input {
    top: 0px;
    background: none;
    appearance: none;
}

.range-slider input[type="range"]::-webkit-slider-thumb {
    height: 17px;
    width: 17px;
    border-radius: 50%;
    background: #adb5bd;
    pointer-events: auto;
    -webkit-appearance: none;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
    cursor: pointer;
}
.range-slider input[type="range"]:disabled::-webkit-slider-thumb,
.range-slider input[type="range"]:disabled:-moz-range-thumb {
    display: none;
}
.range-slider input[type="range"]::-moz-range-thumb {
    height: 17px;
    width: 17px;
    border: none;
    border-radius: 50%;
    background: #adb5bd;
    pointer-events: auto;
    -moz-appearance: none;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
    cursor: pointer;
}
</style>