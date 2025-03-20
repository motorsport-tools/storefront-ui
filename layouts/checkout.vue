<script setup lang="ts">
import { SfButton, SfIconArrowBack, SfLoaderCircular } from '@storefront-ui/vue';
import type { CheckoutLayoutProps } from './types';


const localePath = useLocalePath();
const router = useRouter();
const { backToCart = true, heading, backLabel } = defineProps<CheckoutLayoutProps>();
const historyState = router.options.history.state;
const backUrl = localePath(historyState?.back?.toString() ?? '/');
const backHref = backUrl === localePath(router.currentRoute.value.path) ? localePath('/') : backUrl;
const goToPreviousRoute = () => (backToCart ? navigateTo(localePath('/cart')) : navigateTo(localePath(backHref)));

const { cart, loading } = useCart();
</script>

<template>
    <main 
        class="w-full narrow-container bg-white mb-20"
        data-testid="checkout-layout"
    >
        <div class="flex justify-between mt-8 mb-10 md:px-0" hydrate-on-visible>
            <h1 class="font-bold typography-headline-3 md:typography-headline-2 md:pl-4">{{ heading }}</h1>
            <SfButton 
                :class="[$viewport.isLessThan('lg') ? 'flex whitespace-nowrap' : 'lg:flex']"
                :size="$viewport.isLessThan('lg') ? 'sm' : 'base'"
                :aria-label="$t('prevAriaLabel')"
                variant="tertiary"
                @click="goToPreviousRoute"
            >
                <template #prefix>
                    <SfIconArrowBack />
                </template>
                {{ backLabel }}
            </SfButton>
        </div>
        <span v-if="loading && !cart" class="!flex justify-center my-40 h-24">
          <SfLoaderCircular size="2xl" />
        </span>
        <slot v-else />
    </main>
</template>