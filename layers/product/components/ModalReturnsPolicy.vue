<script setup lang="ts">
import { SfModal, SfButton, SfIconClose, useDisclosure } from '@storefront-ui/vue';
const { isOpen, open, close } = useDisclosure({ initialValue: false });
const { modalOverlay } = useReturnsModal()

defineExpose({
  open,
  close
})

watch(isOpen, (newVal) => {
    modalOverlay.value = newVal
})

onUnmounted(() => {
    modalOverlay.value = false
})

</script>
<template>
    <transition
        enter-active-class="transition duration-200 ease-out"
        leave-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-10"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-10"
    >
        <SfModal
            v-model="isOpen"
            class="max-w-[90%] md:max-w-xl z-[110]"
            tag="section"
            role="alertdialog"
            aria-labelledby="promoModalTitle"
            aria-describedby="promoModalDesc"
        >
            <header>
                <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
                    <SfIconClose />
                </SfButton>
                <h3 id="promoModalTitle" class="font-bold typography-headline-4 md:typography-headline-2">
                    30 Day Returns Policy
                </h3>
            </header>
            <NuxtImg src="/img/30-day-return.png" alt="Returns Policy" class="m-auto max-w-[200px]" />
            <p class="mb-4">
                Your purchase is protected by our 30-day returns policy.<br/>If you're not satisfied with your purchase, you may return it for a full refund or exchange within 30 days of receipt. 
            </p>
            <p class="mb-4">
                To be eligible for a return, items must be unused, in their original packaging and include all original accessories and documentation.
            </p>
            <p class="mb-4">
                To initiate a return, visit the order details page. If eligible you will see a button to initiate and submit an RMA request.
            </p>
            <p class="mb-4">
                Once the return is approved and the item(s) are received, your refund or exchange will be processed within 30 days.
            </p>
            <p>
                <em>*Special order items are not eligible for refund/returns.</em>
            </p>
            <footer class="flex justify-end gap-4 mt-4">
                <SfButton @click="close">Confirm</SfButton>
            </footer>
        </SfModal>
    </transition>
</template> 