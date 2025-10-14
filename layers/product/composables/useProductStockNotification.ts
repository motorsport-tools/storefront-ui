import type {
    MutationStockNotificationArgs,
    StockSubscribeResponse
} from "~/graphql"
import { MutationName } from "~/server/mutations"
import { useToast } from "vue-toastification"

const toast = useToast()

export const useProductStockNotification = () => {
    const { $sdk } = useNuxtApp()
    const { t } = useI18n()
    const loading = ref(false)

    const stockSubscribe = async (
        params: MutationStockNotificationArgs
    ) => {
        try {
            loading.value = true

            await $sdk().odoo.mutation<
                MutationStockNotificationArgs,
                StockSubscribeResponse
            >({ mutationName: MutationName.StockNotificationMutation }, params)
            toast.success(t('productInfo.notifSuccess'))
        } finally {
            loading.value = false
        }

        return true
    }

    return {
        loading,
        stockSubscribe,
    }
}