<script lang="ts" setup>
import { SfIconBase } from '@storefront-ui/vue'

defineProps<{
    isPlaying: boolean
}>()

</script>
<template>
    <button
        class="splide__toggle 
        border-transparent
        hover:background-neutral-200"
        title="Play/Pause Autoplay"
        :aria-label="isPlaying ? 'Pause autoplay' : 'Start autoplay'"
    >   
        
        <SfIconBase v-if="!isPlaying"
            class="splide__toggle__play w-7 h-7 fill-white text-white!"
            viewBox="0 0 26 26"
        >
            <path fill="#fff" d="M20.208 11.857L6.902 5.26a1.31 1.31 0 0 0-1.268.052a1.27 1.27 0 0 0-.619 1.09V19.6c0 .443.233.856.619 1.089a1.32 1.32 0 0 0 1.269.052l13.306-6.599c.438-.218.716-.658.716-1.143s-.279-.924-.717-1.142"/>

        </SfIconBase>
        <SfIconBase
            v-else
            class="splide__toggle__pause w-7 h-7 fill-white text-white!"
            viewBox="0 0 12 12"
        >
            <path fill="none" stroke="#fff" stroke-linecap="round" stroke-width="2" d="M4 2v8m4-8v8"/>
        </SfIconBase>
    </button>
</template>
<style>
.splide__toggle {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 50;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>