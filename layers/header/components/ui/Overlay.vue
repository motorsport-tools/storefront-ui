<script setup lang="ts">
if (import.meta.client) {
    import('~/assets/css/transitions.css')
}
const props = defineProps({
    isOpen: Boolean
})
</script>
<template>
    <transition
       name="backdrop-fade"
    >
        <div v-if="isOpen" class="fixed inset-0 bg-[#222222] backdrop-blur-xl bg-opacity-50 z-[9]"
        />
    
    </transition>
</template>