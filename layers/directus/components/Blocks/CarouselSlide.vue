<script setup lang="ts">
import type { BlockSliderSlide } from '../../shared/types/schema';

interface Props {
    slide: BlockSliderSlide
    itemKey: number
}

const props = defineProps<Props>()

const { getBlockComponent } = useBlockRegistry()

const slideRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
    if (!slideRef.value) return

    const observer = new IntersectionObserver(
        ([entry]) => {
            isVisible.value = entry.isIntersecting
        },
        { threshold: 0.5 }
    )

    observer.observe(slideRef.value)

    onUnmounted(() => observer.disconnect())
})
</script>

<template>
    <div
        ref="slideRef"
        class="cs w-full h-full relative h-60 lg:h-[30rem] overflow-hidden"
        :class="{ 'cs--visible': isVisible }"
    >

        <NuxtImg
            v-if="slide?.background_image"
            class="cs__img w-full h-full object-cover absolute z-0"
            :loading="itemKey >= 1 ? 'lazy' : 'eager'"
            :fetchpriority="itemKey == 0 ? 'high' : 'auto'"
            :src="slide?.background_image?.filename_disk"
            sizes="100vw sm:1024px lg:1280px xl:1536px"
            format="webp"
            quality="75"
            provider="directus"
            :alt="slide?.background_image?.title ? slide?.background_image.title : `Promotional image slide ${itemKey}`"
        />
        <!-- Video background -->
        <video
            v-if="slide?.background_video"
            class="w-full h-full object-cover absolute z-0"
            autoplay muted loop playsinline
        >
            <source :src="`/assets/${slide?.background_video}`" />
        </video>

        <div class="cs__overlay absolute inset-0 z-[1]" />

        <div class="cs__accent absolute z-[2]" />

        <div class="cs__carbon absolute inset-0 z-[2]" />

        <div class="cs__bottom absolute z-[2]" />

        <div class="cs__content px-20 h-full relative z-[3] flex flex-col items-start justify-end">
            <component
                v-if="slide?.block_content"
                v-for="(block, blockIndex) in slide?.block_content"
                :key="block.id"
                :is="getBlockComponent(block.collection)"
                :blockData="block.item"
                class="cs__block"
                :style="{ transitionDelay: `${0.4 + blockIndex * 0.4}s` }"
            />
        </div>
    </div>
</template>

<style lang="css" scoped>
.cs__img {
    animation: kenBurns 20s ease-in-out alternate infinite;
    filter: contrast(1.05) saturate(1.1);
}

@keyframes kenBurns {
    0%   { transform: scale(1); }
    100% { transform: scale(1.08); }
}

.cs__overlay {
    background:
        linear-gradient(
            to right,
            rgba(0, 0, 0, 0.75) 0%,
            rgba(0, 0, 0, 0.45) 40%,
            rgba(0, 0, 0, 0.15) 100%
        ),
        linear-gradient(
            to top,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.2) 50%,
            transparent 100%
        );
    pointer-events: none;
    opacity: 0.90;
}

.cs__accent {
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: #CD1619;
    box-shadow:
        0 0 20px rgba(205, 22, 25, 0.5),
        0 0 60px rgba(205, 22, 25, 0.2);
}


@media (min-width: 1024px) {
    .cs__accent { width: 6px; }
}

.cs__carbon {
    pointer-events: none;
    opacity: 0.1;
    background-image: radial-gradient(circle at center center, transparent,rgb(33,33,33)),repeating-linear-gradient(135deg, rgb(33,33,33) 0px, rgb(33,33,33) 2px,transparent 2px, transparent 10px,rgb(33,33,33) 10px, rgb(33,33,33) 11px,transparent 11px, transparent 21px),repeating-linear-gradient(45deg, rgb(47,47,47) 0px, rgb(47,47,47) 4px,transparent 4px, transparent 8px),linear-gradient(90deg, rgb(33,33,33),rgb(33,33,33));
}

.cs__bottom {
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #CD1619 0%, rgba(205, 22, 25, 0.15) 60%, transparent 100%);
    pointer-events: none;
}

.cs__content {
    padding: 2rem 1.5rem 2.5rem;
}

@media (min-width: 1024px) {
    .cs__content {
        padding: 3rem 5rem 3.5rem;
    }
}

.cs__block {
    transform: translateX(-30px);
    opacity: 0;
    transition:
        transform 1.2s cubic-bezier(0.16, 1, 0.3, 1),
        opacity 1s ease;
}

.cs--visible .cs__block {
    transform: translateX(0);
    opacity: 1;
}

:deep(h2),
:deep(h3),
:deep(h4),
:deep(h5),
:deep(h6) {
    font-weight: 800;
    color: #fff;
    font-family: "Figtree", system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    line-height: 1.1;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
}

:deep(h2) {
    font-size: 1.5rem;
    font-weight: 400;
    text-transform: none;
    letter-spacing: normal;
    line-height: 1.35;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 0.25rem;
}

:deep(h3) {
    font-size: 2rem;
    border-left: 4px solid #CD1619;
    padding-left: 0.75rem;
    margin-bottom: 0.5rem;
}

:deep(h4) {
    font-size: 1.1rem;
    color: #CD1619;
    letter-spacing: 0.1em;
    font-weight: 700;
}

:deep(h5) {
    font-size: 1rem;
}

:deep(h6) {
    font-size: 0.875rem;
}

@media (min-width: 1024px) {
    :deep(h2) { font-size: 1.75rem; }
    :deep(h3) { font-size: 3rem; }
    :deep(h4) { font-size: 1.25rem; }
}


:deep(p) {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    line-height: 1.6;
    max-width: 45ch;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

@media (min-width: 1024px) {
    :deep(p) { font-size: 1.05rem; }
}


:deep(a),
:deep(button) {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

:deep(a:hover),
:deep(button:hover) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(205, 22, 25, 0.35);
}
</style>
