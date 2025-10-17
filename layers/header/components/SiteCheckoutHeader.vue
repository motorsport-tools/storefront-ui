<script lang="ts" setup>

const headerRef = ref(null)
</script>
<template>
    <header
        ref="headerRef"
    >
        <div 
            class="h-[48px] max-h-[48px] bg-white border-black-500/50 border-b flex flex-row justify-between items-center flex-nowrap px-2 lg:px-4 relative z-[20]"
        >
            <NuxtLink 
                to="/"
                aria-label="Motorsport-Tools Homepage"
                class="h-full block w-[250px] flex align-center pr-2"
            >
                <Logo />
            </NuxtLink>
        </div>
        <div 
            class="flex bg-[#222222] text-white items-center justify-center flex-nowrap relative h-[5px]"
        >
        </div>
    </header>
</template>

