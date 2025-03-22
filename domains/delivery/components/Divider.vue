<script setup>
defineProps({
  fontSize: {
    type: String,
    default: "xs"
  }
});
</script>

<template>
    <div class="w-full my-4">
      <div class="relative">
        <div class="w-full flex items-center absolute inset-2.5">
          <div class="w-full border-t"></div>
        </div>
        <div class="flex w-full justify-center relative">
          <span :class="`bg-white px-2 text-${fontSize}`"><slot /></span>
        </div> 
      </div>
    </div>
</template>