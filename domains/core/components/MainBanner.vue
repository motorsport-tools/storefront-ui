<template>
  <div class="relative min-h-[600px] mb-10">
    <div
      class="md:flex md:flex-row-reverse md:justify-center min-h-[600px] max-w-screen-3xl mx-auto"
    >
      <div
        class="flex flex-col justify-center md:basis-2/4 md:items-stretch md:overflow-hidden"
      >
        <NuxtImg
          src="/images/main-banner.webp"
          alt="Hero"
          width="500"
          height="400"
          fetchpriority="high"
          format="webp"
          preload
        />
      </div>
      <div
        class="md:flex md:flex-col md:justify-center md:items-start md:basis-2/4"
      >
        <p
          class="typography-text-xs md:typography-text-sm font-bold tracking-widest text-neutral-500 uppercase"
        >
          SPECIAL OFFER
        </p>
        <h1
          class="typography-headline-2 md:typography-headline-1 md:leading-[67.5px] font-bold mt-2 mb-4"
        >
          Jackets hot drops
        </h1>
        <p class="typography-text-base md:typography-text-lg">
          This fashionable jackets collection features various colors, comfort
          and style.
        </p>
        <div class="flex flex-col md:flex-row gap-4 mt-6">
          <SfButton
            size="lg"
            :tag="NuxtLink"
            to="/search"
          >
            Shop Now
          </SfButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfButton } from "@storefront-ui/vue";

const NuxtLink = resolveComponent("NuxtLink");
</script>
