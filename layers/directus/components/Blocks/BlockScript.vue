<script setup lang="ts">
interface Props {
    blockData: Object
}

const props = defineProps<Props>()
const container = ref<HTMLElement | null>(null)

onMounted(() => {
    const script = document.createElement('script')
    script.src = props.blockData?.content
    script.async = true
    script.type = 'text/javascript'
    container.value?.appendChild(script)
})
</script>
<template>
    <div 
        ref="container"
        class="block-script"
    >
    </div>
</template>
