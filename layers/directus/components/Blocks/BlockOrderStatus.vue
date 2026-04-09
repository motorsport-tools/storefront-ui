<script setup lang="ts">
import { SfButton, SfLoaderCircular } from '@storefront-ui/vue';
import { useSearchOrder } from '~/layers/orders/composable/useSearchOrder';
import { type BlockOrderStatu } from '../../shared/types/schema';

interface Props {
    blockData: BlockOrderStatu
}
const props = defineProps<Props>()

const { t } = useI18n()

const { search, loading, errorMessage } = useSearchOrder();

const orderNumber = ref('');
const email = ref(false);
const paddle = ref('');

const handleSubmit = async () => {
    const val = String(orderNumber.value || '').trim();

    if(email.value) {
        await navigateTo(`/`)
        return
    }

    if (val.indexOf('MST-') !== 0) {
        errorMessage.value = t('orderSearch.invalidOrderId')
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paddle.value)) {
        errorMessage.value = t('orderSearch.invalidEmail')
        return;
    }

    const result = await search(paddle.value, orderNumber.value);

    if (result) {
        const { model, resId, accessToken, pid } = result;
        await navigateTo(`/order/${Number(resId)}?access_token=${encodeURIComponent(String(accessToken))}&model=${encodeURIComponent(String(model))}&pid=${Number(pid)}`);
    } 
};
</script>

<template>
    <div class="mx-auto max-w-[600px] w-full px-4 py-8">
        <div class="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-neutral-200">
            <h2 class="text-2xl font-bold mb-2 text-neutral-900">
                {{ $t('orderSearch.heading') }}
            </h2>
            <p class="text-neutral-600 mb-8">
                {{ $t('orderSearch.description') }}
            </p>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div v-if="errorMessage" class="bg-negative-100 border border-negative-200 text-negative-700 px-4 py-3 rounded relative" role="alert">
                    <span class="block sm:inline">{{ errorMessage }}</span>
                </div>

                <div class="flex flex-col gap-1.5">
                    <label for="order-id" class="text-sm font-medium text-neutral-900">
                        {{ $t('orderSearch.orderIdLabel') }}
                    </label>
                    <UiFormCustomSfInput
                        id="order-id"
                        v-model="orderNumber"
                        name="orderNumber"
                        type="text"
                        :placeholder="$t('orderSearch.orderIdLabel')"
                        required
                        :disabled="loading"
                    />
                </div>

                <div class="flex flex-col gap-1.5">
                    <input
                        id="email"
                        v-model="email"
                        type="text"
                        name="email"
                        autocomplete="nope"
                        tabindex="-1"
                        aria-hidden="true"
                        class="absolute opacity-0 pointer-events-none -z-10 h-0 w-0"
                        :disabled="loading"
                    />
                    <label for="paddle" class="text-sm font-medium text-neutral-900">
                        {{ $t('orderSearch.emailLabel') }}
                    </label>
                    <UiFormCustomSfInput
                        id="paddle"
                        v-model="paddle"
                        name="paddle"
                        type="email"
                        :placeholder="$t('orderSearch.emailLabel')"
                        required
                        :disabled="loading"
                    />
                </div>

                <div class="flex flex-col lg:flex-row justify-end mt-8">
                    <SfButton
                        type="submit"
                        class="w-full lg:w-auto min-w-[150px]"
                        :disabled="loading"
                    >
                        <template v-if="loading">
                            <SfLoaderCircular size="sm" class="mx-auto" />
                        </template>
                        <template v-else>
                            {{ $t('orderSearch.submit') }}
                        </template>
                    </SfButton>
                </div>
            </form>
        </div>
    </div>
</template>