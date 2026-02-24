<script setup lang="ts">
interface Props {
    blockData: Object
}

const props = defineProps<Props>()
const container = ref<HTMLElement | null>(null)
let script: HTMLScriptElement

const cleanupRecaptcha = () => {
    document.querySelectorAll('.grecaptcha-badge').forEach(el => el.parentElement?.remove())

    document.querySelectorAll('iframe[src*="recaptcha"]').forEach(el => el.remove())

    document.querySelectorAll('script[src*="recaptcha"]').forEach(el => el.remove())
}

const cleanupMautic = () => {
    document.querySelectorAll('iframe[id*=mauticiframe]').forEach(el => el.remove())
}



onMounted(() => {
    script = document.createElement('script')
    script.src = props.blockData?.content
    script.async = true
    script.type = 'text/javascript'
    container.value?.appendChild(script)
})
onUnmounted(() => {
    container.value?.removeChild(script)
})
onBeforeRouteLeave(() => {
    cleanupRecaptcha()
    cleanupMautic()
})
</script>
<template>
    <div 
        ref="container"
        class="block-script"
        :key="blockData.id"
    >
    </div>
</template>
