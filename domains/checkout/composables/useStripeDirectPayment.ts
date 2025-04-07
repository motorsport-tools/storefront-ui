import type {
    PaymentTransaction,
    MutationStripeProviderInfoArgs,
    StripeProviderInfoResponse,
    PaymentProvider,
    MutationStripeGetInlineFormValuesArgs,
    StripeGetInlineFormValueResponse,
    MutationStripeTransactionArgs,
    StripeTransactionResponse
} from "~/graphql"
import { MutationName } from "~/server/mutations";

export const useStripeDirectPayment = (providerId: number, cartId: number, partnerId: number, pmCode: string) => {
    const { $sdk } = useNuxtApp()

    const acquirerInfo = useState<PaymentProvider>(
        `acquirerInfo-${cartId}`,
        () => ({}) as PaymentProvider
    );

    const transaction = useState<PaymentTransaction>(
        `transaction-${cartId}`,
        () => ({}) as PaymentTransaction
    );

    const openStripeTransaction = async (tokenizationRequested: boolean) => {
        const { data } = await $sdk().odoo.mutation<
            MutationStripeTransactionArgs,
            StripeTransactionResponse
        >(
            {
                mutationName: MutationName.StripeTransaction,
            },
            { providerId, tokenizationRequested }
        );

        transaction.value = data.value?.stripeTransaction?.transaction || {};
    }

    const getStripeAcquirerInfo = async () => {
        const { data } = await $sdk().odoo.mutation<
            MutationStripeProviderInfoArgs,
            StripeProviderInfoResponse
        >({
            mutationName: MutationName.StripeProviderInfo
        }, {
            providerId
        })
        acquirerInfo.value = data?.value?.stripeProviderInfo.stripeProviderInfo || {}
    }

    const getStripeInlineFormValues = async () => {
        const { data } = await $sdk().odoo.mutation<
            MutationStripeGetInlineFormValuesArgs,
            StripeGetInlineFormValueResponse
        >({
            mutationName: MutationName.StripeInlineFormValues
        }, {
            providerId, pmCode
        })

        return data.value?.stripeGetInlineFormValues?.stripeGetInlineFormValues
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