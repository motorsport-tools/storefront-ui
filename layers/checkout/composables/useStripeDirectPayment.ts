import type {
    PaymentTransaction,
    MutationStripeProviderInfoArgs,
    StripeProviderInfoResponse,
    StripeProviderInfo,
    MutationStripeGetInlineFormValuesArgs,
    StripeGetInlineFormValueResponse,
    MutationStripeTransactionArgs,
    StripeTransactionResponse
} from "~/graphql"
import { MutationName } from "~/server/mutations";

export const useStripeDirectPayment = (providerId: number, cartId: number, pmCode: string) => {
    const { $sdk } = useNuxtApp()

    const acquirerInfo = useState<StripeProviderInfo>(
        `acquirerInfo-${cartId}`,
        () => ({}) as StripeProviderInfo
    );

    const transaction = useState<PaymentTransaction>(
        `transaction-${cartId}`,
        () => ({}) as PaymentTransaction
    );

    const openStripeTransaction = async (tokenizationRequested: boolean, isExpress: boolean) => {
        const data = await $sdk().odoo.mutation<
            MutationStripeTransactionArgs,
            StripeTransactionResponse
        >(
            {
                mutationName: MutationName.StripeTransaction,
            },
            { providerId, tokenizationRequested, isExpress }
        );

        transaction.value = data.stripeTransaction?.transaction || {};
    }

    const getStripeAcquirerInfo = async () => {
        const data = await $sdk().odoo.mutation<
            MutationStripeProviderInfoArgs,
            StripeProviderInfoResponse
        >({
            mutationName: MutationName.StripeProviderInfo
        }, {
            providerId
        })
        acquirerInfo.value = data?.stripeProviderInfo.stripeProviderInfo || {}
    }

    const getStripeInlineFormValues = async () => {
        const data = await $sdk().odoo.mutation<
            MutationStripeGetInlineFormValuesArgs,
            StripeGetInlineFormValueResponse
        >({
            mutationName: MutationName.StripeInlineFormValues
        }, {
            providerId, pmCode
        })

        return data?.stripeGetInlineFormValues?.stripeGetInlineFormValues
    }

    return {
        acquirerInfo,
        transaction,
        openStripeTransaction,
        getStripeAcquirerInfo,
        getStripeInlineFormValues
    }
}

export default useStripeDirectPayment