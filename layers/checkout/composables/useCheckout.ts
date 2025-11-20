import { ref, computed, readonly } from 'vue'
import type { AddressEnum } from '~/graphql'

export interface CheckoutStep {
    id: string
    component: any
    title: string
    completed: boolean
    data?: Record<string, any>
    exData?: Record<string, any>
    addressType?: AddressEnum,
    condition?: () => boolean
}

const STORAGE_KEY = 'checkout_progress'

export const useCheckout = () => {
    const steps = ref<CheckoutStep[]>([])
    const currentStepId = ref<string>('')

    console.log('Checkout composable initialized', steps.value)

    // Initialize from localStorage
    const initFromStorage = () => {
        if (import.meta.client) {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                try {
                    const { stepStates, currentId } = JSON.parse(saved)
                    currentStepId.value = currentId

                    // Restore step completion states and data
                    steps.value.forEach((step, index) => {
                        if (stepStates[step.id]) {
                            step.completed = stepStates[step.id].completed
                            step.data = stepStates[step.id].data
                        }
                    })
                } catch (e) {
                    console.error('Failed to restore checkout state:', e)
                }
            }
        }
    }

    // Save to localStorage
    const saveToStorage = () => {
        if (import.meta.client) {
            const stepStates = steps.value.reduce((acc, step) => {
                acc[step.id] = {
                    completed: step.completed,
                    data: step.data
                }
                return acc
            }, {} as Record<string, any>)

            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                stepStates,
                currentId: currentStepId.value
            }))
        }
    }

    // Register steps (call this once on mount)
    const registerSteps = (stepDefinitions: Omit<CheckoutStep, 'completed' | 'data'>[]) => {
        steps.value = stepDefinitions.map(step => ({
            ...step,
            completed: false,
            data: {},
            condition: step.condition
        }))
        if (!currentStepId.value || currentStepId.value === '') {
            const firstApplicable = steps.value.find(s => !s.condition || s.condition())
            currentStepId.value = firstApplicable?.id || ''
        }
        initFromStorage()
    }

    // Mark current step as complete and move to next
    const completeStep = (data?: Record<string, any>) => {
        const currentStep = steps.value.find(s => s.id === currentStepId.value)
        console.log('Completing step', currentStepId.value, 'with data', data)
        if (currentStep) {
            currentStep.completed = true
            if (data) {
                currentStep.data = { ...currentStep.data, ...data }
            }

            // Move to next step if available
            const currentIndex = steps.value.findIndex(s => s.id === currentStepId.value)
            const nextStep = steps.value.slice(currentIndex + 1).find(s => !s.condition || s.condition())

            if (nextStep) {
                currentStepId.value = nextStep.id
            }

            saveToStorage()
        }
    }

    const goToStep = (stepId: string) => {
        const targetStep = steps.value.find(s => s.id === stepId)
        if (!targetStep) return

        /* Can't go to step if condition fails */
        if (targetStep.condition && !targetStep.condition()) return

        const targetIndex = steps.value.findIndex(s => s.id === stepId)

        /* Can go to first step always */
        if (targetIndex === 0) {
            currentStepId.value = stepId
            saveToStorage()
            return
        }

        /* Can only go to completed steps or current step */
        const currentIndex = steps.value.findIndex(s => s.id === currentStepId.value)
        if (targetStep.completed || targetIndex <= currentIndex) {
            currentStepId.value = stepId
            saveToStorage()
        }
    }

    // Update step data without completing
    const updateStepData = (data: Record<string, any>) => {
        const currentStep = steps.value.find(s => s.id === currentStepId.value)
        if (currentStep) {
            currentStep.data = { ...currentStep.data, ...data }
            saveToStorage()
        }
    }

    // Reset checkout
    const resetCheckout = () => {
        steps.value.forEach(step => {
            step.completed = false
            step.data = {}
        })
        const firstApplicable = steps.value.find(s => !s.condition || s.condition())
        currentStepId.value = firstApplicable?.id || ''
        if (import.meta.client) {
            localStorage.removeItem(STORAGE_KEY)
        }
    }

    // Reset Delivery Onwards
    const resetCheckoutFromStep = (stepId: string) => {
        const targetIndex = steps.value.findIndex(s => s.id === stepId)
        if (targetIndex === -1) return
        const targetStep = steps.value.find(s => s.id === stepId)
        if (!targetStep) return

        steps.value.slice(targetIndex).forEach(step => {
            step.completed = false
            step.data = {}
        })

        currentStepId.value = targetStep.id
        saveToStorage()
    }

    // Get data from a specific step
    const getStepData = (stepId: string) => {
        return computed(() => {
            const step = steps.value.find(s => s.id === stepId)
            return step?.data || {} as any
        })
    }

    // Get all checkout data
    const getAllData = () => {
        return steps.value.reduce((acc, step) => {
            acc[step.id] = step.data
            return acc
        }, {} as Record<string, any>)
    }

    const applicableSteps = computed(() => {
        return steps.value.filter(step => !step.condition || step.condition())
    })
    const isLastStep = computed(() => {
        const applicable = applicableSteps.value
        const currentInApplicable = applicable.findIndex(s => s.id === currentStepId.value)
        return currentInApplicable === applicable.length - 1
    })
    const allStepsCompleted = computed(() => {
        return applicableSteps.value.filter(step => !step.condition || step.condition()).every(s => s.completed)
    })


    // Visible steps are current step and all completed steps
    const visibleSteps = computed(() => {
        return steps.value.filter((step, index) => {

            if (step.condition && !step.condition()) return false

            return true
        })
    })


    return {
        steps: readonly(steps),
        visibleSteps,
        currentStepId: readonly(currentStepId),
        isLastStep,
        allStepsCompleted,
        registerSteps,
        completeStep,
        goToStep,
        updateStepData,
        resetCheckout,
        getStepData,
        getAllData,
        resetCheckoutFromStep
    }
}