<script lang="ts" setup>

</script>

<template>
  <HeaderDesktop v-if="$viewport.isGreaterOrEquals('lg')" />
  <HeaderMobile v-else />
</template>
