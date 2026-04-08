<script setup lang="ts">
import { SfButton, SfLoaderCircular } from '@storefront-ui/vue';
import { useSearchOrder } from '~/layers/orders/composable/useSearchOrder';
import { type BlockOrderStatu } from '../../shared/types/schema';

interface Props {
    blockData: BlockOrderStatu
}
const props = defineProps<Props>()

const { search, loading, errorMessage } = useSearchOrder();

const i18n = useI18n();

const orderNumber = ref('');
const email = ref('');

const handleSubmit = async () => {
    const result = await search(email.value, orderNumber.value);

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
                    />
                </div>

                <div class="flex flex-col gap-1.5">
                    <label for="email" class="text-sm font-medium text-neutral-900">
                        {{ $t('orderSearch.emailLabel') }}
                    </label>
                    <UiFormCustomSfInput
                        id="email"
                        v-model="email"
                        name="email"
                        type="email"
                        :placeholder="$t('orderSearch.emailLabel')"
                        required
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