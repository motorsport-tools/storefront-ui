<script lang="ts" setup>
defineProps<{
  filled?: boolean;
}>();
</script>

<template>
  <NuxtImg
    src="/img/motorsport-tools-logo.svg"
    fetchpriority="high"
    alt="Motorsport-Tools"
    preload
    width="242"
    height="47"
  />
</template>