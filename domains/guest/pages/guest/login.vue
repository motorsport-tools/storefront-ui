<script setup lang="ts">
import { SfButton, SfLink } from '@storefront-ui/vue';

definePageMeta({
    pageType: 'static',
    middleware: ['guest'],
});

const showMethods = true

const NuxtLink = resolveComponent('NuxtLink');

</script>

<template>
    <NuxtLayout 
        name="checkout" 
        :back-label="$t('back')" 
        :heading="$t('checkout')"
    >
        <div class="lg:w-full lg:flex md:justify-center">
            <div class="flex flex-col gap-4 p-2 lg:p-6 rounded-md w-full md:w-2/3 lg:w-1/2 3xl:w-2/5">
                <h2 class="font-bold text-lg">{{ $t('guest.guestCheckout') }}</h2>
                <SfButton
                    data-testid="guest-checkout-button"
                    :tag="NuxtLink"
                    to="/checkout"
                    class="w-full my-4"
                >
                    {{ $t('guest.continueAsGuest') }}
                </SfButton>

                <template v-if="showMethods">
                    <UiDividerText :text="$t('or')" />
                    
                        <h3 class="text-center">Google Pay</h3>
                        <h3 class="text-center">Apple Pay</h3>
                        <h3 class="text-center">PayPal</h3>
                        <p class="text-center">And anything else... Todo change!</p>
                </template>

                <UiDividerText :text="$t('or')" />
                <h2 class="font-bold text-lg">{{ $t('guest.loginHeading') }}</h2>
                <LoginForm/>

                <UiAlert
                    class="mt-6 w-full p-4 md:p-6 !justify-start typography-text-base flex-col"
                    variant="neutral"
                >
                    <h3  class="font-bold text-lg">{{ $t('guest.noAccount') }}</h3>
                    <p>{{ $t('guest.createAfterOrder') }}</p>
                    <SfButton
                        data-testid="guest-checkout-button"
                        :tag="NuxtLink"
                        to="/checkout"
                        class="w-full my-4"
                        variant="secondary"
                    >
                        {{ $t('guest.continueAsGuest') }}
                    </SfButton>
                </UiAlert>

            </div>
        </div>
    </NuxtLayout>
</template>