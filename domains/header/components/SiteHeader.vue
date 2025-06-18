<script lang="ts" setup>
const menuRef = ref()
</script>

<template>
    <header
        ref="menuRef"
        class="relative"
    >
        <div 
            class="h-[48px] max-h-[48px] bg-white border-black-500/50 border-y"
        >
            <p>Header</p>
        </div>
    </header>
</template>