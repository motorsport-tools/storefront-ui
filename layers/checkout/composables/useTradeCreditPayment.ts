import type {
    PaymentTransaction,
    MutationTradeCreditTransactionArgs,
    TradeCreditPreparePaymentResponse,
    MutationTradeCreditCreateTransactionArgs,
    TradeCreditTransactionResponse,
    MutationTradeCreditConfirmTransactionArgs,
    TradeCreditConfirmTransactionResponse

} from "~/graphql"
import { MutationName } from "~/server/mutations";

export const useTradeCreditPayment = (providerId: number, cartId: number, pmCode: string) => {
    const { $sdk } = useNuxtApp()

    const transaction = useState<PaymentTransaction>(
        `transaction-${cartId}`,
        () => ({}) as PaymentTransaction
    );

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

    const openCreditTransaction = async (orderId: number | null = null) => {
        const data = await $sdk().odoo.mutation<
            MutationTradeCreditCreateTransactionArgs,
            TradeCreditTransactionResponse
        >(
            {
                mutationName: MutationName.TradeCreditTransaction,
            },
            { providerId, orderId }
        )

        transaction.value = data?.tradeCreditCreateTransaction?.transaction || {}
    }

    const confirmCreditTransaction = async (reference: string | null = null) => {
        const data = await $sdk().odoo.mutation<
            MutationTradeCreditConfirmTransactionArgs,
            TradeCreditConfirmTransactionResponse
        >(
            {
                mutationName: MutationName.TradeCreditConfirmTransaction,
            },
            { reference }
        )

        return data?.tradeCreditConfirmTransaction || {}
    }

    return {
        transaction,
        preparePayment,
        openCreditTransaction,
        confirmCreditTransaction
    }
}

export default useTradeCreditPayment