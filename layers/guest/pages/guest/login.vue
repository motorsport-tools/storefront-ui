<script setup lang="ts">
import { SfButton, SfLink } from '@storefront-ui/vue';

definePageMeta({
    pageType: 'static',
    middleware: ['guest'],
    layout: 'checkout',
});

const showMethods = true

const NuxtLink = resolveComponent('NuxtLink');

const { cart, loadCart } = useCart()

onMounted(async () => {
    await loadCart(true)
})
</script>

<template>
    <main 
        class="w-full narrow-container mb-20"
        data-testid="checkout-layout"
    >
        <CheckoutHeader
            :title="$t('secureCheckout')"
            :backText="$t('backToCart')"
        />
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
                    <ClientOnly>
                        <ProviderStripeExpressCheckout :method="{ code: 'card', providerId: 14 }" :cart="cart"/>
                    </ClientOnly>
                </template>

                <UiDividerText :text="$t('or')" />
                <h2 class="font-bold text-lg">{{ $t('guest.loginHeading') }}</h2>
                <LoginForm redirect-to="/checkout"/>

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
    </main>
</template>