<script setup lang="ts">
import { SfButton } from '@storefront-ui/vue'

defineProps({
    validationError: {
        type: String,
        required: true,
    },  
})
const NuxtLink = resolveComponent("NuxtLink");
</script>
<template>
    <div class="bg-red-100 text-red-800 rounded-lg shadow-sm p-6 w-full my-8 max-w-2xl mx-auto">
        <h2 class="font-medium text-xl">Error with payment link</h2>
        <p class="my-2" >{{ validationError }}</p>
        <p>If you have any questions regarding this payment, please contact support.</p>
        <SfButton 
            to="/"
            :tag="NuxtLink"
            class="mt-4"
        >
            Return to Home
        </SfButton>
    </div>
</template>