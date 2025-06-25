<script setup lang="ts">
const props = defineProps({
    isOpen: Boolean
})
</script>
<template>
    <transition
       name="backdrop-fade"
    >
        <div v-if="isOpen" class="lg:hidden fixed inset-0 bg-[#222222] backdrop-blur-xl bg-opacity-50 z-[9]"
        />
    
    </transition>
</template>

<style>
    .backdrop-fade-enter-active,
    .backdrop-fade-leave-active {
        transition: backdrop-filter 0.5s ease, opacity 0.5s ease;
    }

    .backdrop-fade-leave-active {
        transition-delay: 250ms;
    }

    .backdrop-fade-enter-from,
    .backdrop-fade-leave-to {
        backdrop-filter: blur(0px);
        opacity: 0;
    }

    .backdrop-fade-enter-to,
    .backdrop-fade-leave-from {
        backdrop-filter: blur(25px);
        opacity: 1;
    } 
</style>