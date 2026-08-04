import type {
    PaymentTransaction,
    MutationTradeCreditTransactionArgs,
    TradeCreditPreparePaymentResponse,
    MutationTradeCreditConfirmTransactionArgs,
    TradeCreditConfirmTransactionResponse

} from "~/graphql"
import { MutationName } from "~/server/mutations";

export const useTradeCreditPayment = (providerId: number, cartId: number, pmCode: string) => {
    const { $sdk } = useNuxtApp()

    const preparePayment = async (orderId: number | null = null) => {
        const data = await $sdk().odoo.mutation<
            MutationTradeCreditTransactionArgs,
            TradeCreditPreparePaymentResponse
        >({
            mutationName: MutationName.TradeCreditPreparePayment,
        }, {
            providerId, orderId
        })

        return data?.tradeCreditTransaction || {}
    }

    const confirmCreditTransaction = async (orderId: number | null = null) => {
        const data = await $sdk().odoo.mutation<
            MutationTradeCreditConfirmTransactionArgs,
            TradeCreditConfirmTransactionResponse
        >(
            {
                mutationName: MutationName.TradeCreditConfirmTransaction,
            },
            { order_id: orderId }
        )

        return data?.tradeCreditConfirmTransaction || {}
    }

    return {
        preparePayment,
        confirmCreditTransaction
    }
}

export default useTradeCreditPayment