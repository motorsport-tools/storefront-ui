<script lang="ts" setup>
defineProps<{
  filled?: boolean;
}>();

const img = useImage()
</script>

<template>
  <NuxtImg
    src="/img/motorsport-tools-logo.svg"
    fetchpriority="high"
    alt="Motorsport-Tools"
    preload
    width="262"
    height="57"
    :placeholder="img(`/img/motorsport-tools-logo.svg`)"
  />
</template>