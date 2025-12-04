import type { Payment } from "~/graphql";
import { QueryName } from "~/server/queries";

export const usePaymentLink = () => {
    const { $sdk } = useNuxtApp()
    const loading = ref(false)
    const error = ref<string | null>(null)

    const validatePaymentLink = async (
        saleOrderId: number,
        amount: number,
        accessToken: string
    ) => {
        loading.value = true
        error.value = null

        try {
            const data = await $sdk().odoo.queryNoCache<any, any>({
                queryName: QueryName.PaymentPayQuery,
            }, { saleOrderId: saleOrderId, amount: amount, accessToken: accessToken })


            if (!data?.validate) {
                throw new Error('No response from server')
            }

            const result = data.validate

            if (!result.isValid) {
                error.value = result.errorMessage || 'Invalid payment link'
                return { success: false, requiresLogin: result.requiresLogin, data: null }
            }

            return {
                success: true,
                requiresLogin: false,
                data: {
                    saleOrder: result.saleOrder,
                    transaction: result.transaction
                }
            }

        } catch (err: any) {
            console.error('Payment validation error:', err)
            error.value = err.message || 'Failed to validate payment link'
            return { success: false, requiresLogin: false, data: null }
        } finally {
            loading.value = false
        }
    }

    return {
        loading: readonly(loading),
        error: readonly(error),
        validatePaymentLink
    }
}