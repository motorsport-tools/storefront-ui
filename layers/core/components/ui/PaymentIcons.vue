<script setup lang="ts">
const props = defineProps({
    size: {
        type: Number,
        default: 2
    }
})

const sizeStyle = { 
    width: `${props.size}rem`,
    maxHeight: `${props.size/.5}rem`
}
</script>
<template>
    <div>
        <div class="flex flex-col md:flex-row items-center justify-center gap-2">
            <Icon
                name="logos:visa"
                :style="sizeStyle"
            />
            <Icon
                name="logos:mastercard"
            :style="sizeStyle"
            />
            <Icon
                name="logos:discover"
                :style="sizeStyle"
            />
            <Icon 
                name="logos:jcb"
                :style="sizeStyle"
            />
            <Icon
                name="logos:amex-digital"
                :style="sizeStyle"
            />
            <Icon
                name="logos:google-pay"
                :style="sizeStyle"
            />
            <Icon
                name="logos:apple-pay"
                :style="sizeStyle"
            />
            <Icon
                name="logos:paypal"
                :style="sizeStyle"
            />
        </div>
    </div>
</template>