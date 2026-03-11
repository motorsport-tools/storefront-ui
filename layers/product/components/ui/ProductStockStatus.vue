<script setup lang="ts">
import {
    SfIconCheckCircle,
    SfIconCancel,
    SfIconEmail,
    SfButton,
} from '@storefront-ui/vue'
interface Props {
    stock?: number,
    productId?: number,
    showAvailability?: boolean,
    availableThreshold?: number,
    isStock?: boolean,
    allowOutOfStockOrder?: boolean,
    outOfStockMessage?: string,
    loading?: boolean
}
const props = defineProps<Props>()

const { stockSubscribe, loading: subscribeLoading } = useProductStockNotification()

const inputValue = ref("")
const emailValidation = ref()
const showForm = ref(false)
const formComplete = ref(false)

onMounted(() => {
    const { user, isAuthenticated } = useAuth()
    if(isAuthenticated && user.value.email ) {
        inputValue.value = user.value.email
    }
})

const clickShowForm = () => {
    showForm.value = !showForm.value
}
const subscribeStock = async () => {
    const res = await stockSubscribe({ email: inputValue.value, productId: props.productId as number })
    if(res) {
        inputValue.value = ""
        showForm.value = false
        formComplete.value = true
    }
}
</script>
<template>
    <template v-if="!loading && typeof stock === 'number'">
        <div 
            class="flex flex-row align-center justify-between"
            :class="$attrs.class"
        >
            <div 
                class="flex flex-row items-center text-sm uppercase font-bold py-1"
                :class="{'text-green-500': isStock, 'text-red-500': !isStock}"
                data-test="stock-status"
            >
                <SfIconCheckCircle v-if="isStock" size="sm" />
                <SfIconCancel v-else size="sm" />
                <span class="ml-1 mr-2">{{ $t(`stock.${isStock}`) }}</span>
            </div>
            <div 
                v-if="showAvailability && stock <= (availableThreshold || 0) && stock >= 1"
                class="py-1 px-1 text-xs text-center border rounded text-neutral-600 bg-neutral-100"
                data-text="stock-message"
            >
                {{ $t('stock.availability', { stock }) }}
            </div>
            <div 
                v-if="allowOutOfStockOrder && stock === 0 && outOfStockMessage"
                class="py-1 px-1 text-xs text-center border rounded text-neutral-600 bg-neutral-100"
                v-html="outOfStockMessage"
            >
            </div>
        </div>
        <div
            v-if="!allowOutOfStockOrder && !isStock"
            class="mt-1"
        >
            <SfButton
                v-if="!showForm && !formComplete"
                variant="tertiary"
                size="sm"
                class="!p-0 hover:bg-transparent hover:underline"
                @click="clickShowForm"
            >
                <template #prefix>
                    <SfIconEmail size="xs"/>
                </template>
                {{ $t('productInfo.stockNotification') }}
            </SfButton>
            <form
                v-show="showForm && !formComplete"
                class="w-full py-1 sm:w-auto flex flex-col sm:flex-row gap-4 mb-4 sm:mb-0" @submit.prevent="subscribeStock()"
            >
                <UiFormEmailInput 
                    v-model="inputValue" 
                    @is-field-valid="(n) => (emailValidation = n)" 
                    class="w-full sm:min-w-[300px]"
                />
                <SfButton
                    :disabled="!emailValidation"
                    type="submit" 
                    class="disabled:bg-neutral-100 disabled:text-neutral-600"
                >
                    <Icon
                        name="fa:paper-plane-o"
                        class="size-sm"
                    />
                </SfButton>
            </form>
            <div 
                v-if="formComplete && !showForm"
                class="flex items-center text-neutral-600"
            >
                <Icon
                    name="ic:outline-notifications-none"
                    class="size-sm text-yellow-600"
                />
                <span class="block text-sm">{{ $t('productInfo.notifSuccess') }}</span>
            </div>
        </div>
    </template>
    <div 
        v-else 
        class="flex items-center py-1 min-h-[28px] h-[28px]"
        :class="$attrs.class"
    >
        <div class="w-6 h-6 bg-neutral-200 animate-pulse rounded-full"></div>
        <div class="ml-1 w-24 h-5 bg-neutral-200 animate-pulse rounded"></div>
    </div>
</template>