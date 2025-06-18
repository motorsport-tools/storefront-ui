<script lang="ts" setup>
const menuRef = ref()
</script>

<template>
    <header
        ref="menuRef"
        class="relative"
    >
        <div 
            class="h-[48px] max-h-[48px] bg-white border-black-500/50 border-y flex align-center"
        >
            <NuxtLink 
                to="/"
                aria-label="Motorsport-Tools Homepage"
                class="block w-[250px] flex align-center"
            >
                <Logo />
            </NuxtLink>    
        </div>
    </header>
</template>