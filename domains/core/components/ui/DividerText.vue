<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
        required: true
    }
})

</script>
<template>
    <div class="w-full">
      <div class="flex justify-center w-full">
        <slot name="above" />
      </div>
  
      <div class="flex items-center justify-center w-full my-2">
        <div class="border-t-2 flex-grow" />
        <p class="px-2 text-sm uppercase text-gray-500">{{ props.text }}</p>
        <div class="border-t-2 flex-grow" />
      </div>
  
      <div class="flex justify-center w-full">
        <slot name="below" />
      </div>
    </div>
</template>