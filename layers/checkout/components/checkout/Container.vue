<script setup lang="ts">
const props = defineProps<{
    visibleSteps?: Array<any>
    currentStepId?: string
    completeStep?: Function
    goToStep?: Function
    updateStepData?: Function
}>()

onMounted(() => {
    //resetCheckout()
    console.log('Checkout Container Mounted')    
})
</script>
<template>
    <div class="flex gap-4 mb-8 overflow-x-auto pb-4">
        <div 
            v-for="(step, index) in visibleSteps" 
            :key="step.id"
            class="flex flex-col items-center gap-2 cursor-pointer transition-opacity min-w-fit"
            :class="{ 
                'opacity-100': step.id === currentStepId || step.completed,
                'opacity-50': step.id !== currentStepId && !step.completed
            }"
            @click="goToStep(step.id)"
        >
            <div 
                class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors"
                :class="{
                    'bg-green-500 text-white': step.id === currentStepId,
                    'bg-blue-500 text-white': step.completed && step.id !== currentStepId,
                    'bg-gray-300': !step.completed && step.id !== currentStepId
                }"
            >
                <span v-if="step.completed && step.id !== currentStepId">✓</span>
                <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="text-sm text-center font-medium">{{ step.title }}</div>
        </div>
    </div>
    <div class="min-h-[400px]">
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />

        <div 
            v-for="(step, index) in visibleSteps" 
            :key="step.id"
            class="transition-all duration-300"
            :class="{ 'animate-fadeIn': step.id === currentStepId }"
        >
            <component
                v-show="step.id === currentStepId || step.completed"
                :active="step.id === currentStepId"
                :key="step.id"
                :is="step.component" 
                :showSummary="step.completed && step.id !== currentStepId"
                :step-data="step.data"
                :exData="step.exData"
                :addressType="step.addressType || null"
                @complete="completeStep"
                @update="updateStepData"
                @click="goToStep(step.id)"
            />
            <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        </div>
    </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>