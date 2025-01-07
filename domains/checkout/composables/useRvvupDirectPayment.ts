import type {
    PaymentTransaction,
    PaymentProvider,
    RvvupPaymentMethodsResponse,
    RvvupTransactionResponse,
    RvvupProviderInfoResponse,
    MutationRvvupPaymentMethodsArgs,
    MutationRvvupPaymentDetailsArgs,
    MutationRvvupProviderInfoArgs,
    MutationRvvupTransactionArgs,
    RvvupPaymentDetailsResponse,
    Mutation,
    RvvupPaymentsResponse,
    MutationRvvupPaymentsArgs,
  } from "~/graphql";
  import { MutationName } from "~/server/mutations";
  
  const useRvvupDirectPayment = (providerId: number, cartId?: number) => {
    const { $sdk } = useNuxtApp();
  
    const transaction = useState<PaymentTransaction>(
      `transaction-${cartId}`,
      () => ({}) as PaymentTransaction
    );
    const acquirerInfo = useState<PaymentProvider>(
      `acquirerInfo-${cartId}`,
      () => ({}) as PaymentProvider
    );
    const paymentMethods = useState<Mutation["rvvupPaymentMethods"][]>(
      `paymentMethods-${cartId}`,
      () => []
    );
    const paymentDetails = useState<Mutation["rvvupPaymentDetails"]>(
      `paymentDetails-${cartId}`,
      () => ({}) as Mutation["rvvupPaymentDetails"]
    );
  
    const openRvvupTransaction = async () => {
      const { data } = await $sdk().odoo.mutation<
        MutationRvvupTransactionArgs,
        RvvupTransactionResponse
      >(
        {
          mutationName: MutationName.RvvupTransaction,
        },
        { providerId }
      );
  
      transaction.value = data.value?.rvvupTransaction?.transaction || {};
    };
  
    const getRvvupAcquirerInfo = async () => {
      const { data } = await $sdk().odoo.mutation<
        MutationRvvupProviderInfoArgs,
        RvvupProviderInfoResponse
      >(
        {
          mutationName: MutationName.RvvupProviderInfo,
        },
        { providerId }
      );
  
      acquirerInfo.value =
        data?.value?.rvvupProviderInfo?.rvvupProviderInfo || {};
    };
  
    const getRvvupPaymentMethods = async () => {
      const { data } = await useAsyncData("payment-methods", async () => {
        const { data } = await $sdk().odoo.mutation<
          MutationRvvupPaymentMethodsArgs,
          RvvupPaymentMethodsResponse
        >({ mutationName: MutationName.RvvupPaymentMethods }, { providerId });
  
        return data.value;
      });
  
      paymentMethods.value =
        data?.value?.rvvupPaymentMethods?.rvvupPaymentMethods || [];
    };
  
    const getRvvupPaymentDetails = async (
      params: MutationRvvupPaymentDetailsArgs
    ) => {
      const { data } = await $sdk().odoo.mutation<
        MutationRvvupPaymentDetailsArgs,
        RvvupPaymentDetailsResponse
      >({ mutationName: MutationName.RvvupPaymentDetails }, { ...params });
  
      paymentDetails.value =
        data?.value?.rvvupPaymentDetails?.rvvupPaymentDetails || {};
    };
  
    const rvvupMakeDirectPayment = async (params: MutationRvvupPaymentsArgs) => {
      const { data } = await useAsyncData("make-direct-payment", async () => {
        const { data } = await $sdk().odoo.mutation<
          MutationRvvupPaymentsArgs,
          RvvupPaymentsResponse
        >(
          {
            mutationName: MutationName.RvvupPayments,
          },
          { ...params }
        );
  
        return data.value;
      });
  
      return data?.value?.rvvupPayments?.rvvupPayments || {};
    };
  
    const setTransaction = (transactionParam: PaymentTransaction) =>
      (transaction.value = transactionParam);
  
    return {
      getRvvupPaymentMethods,
      paymentMethods,
      transaction,
      acquirerInfo,
      openRvvupTransaction,
      rvvupMakeDirectPayment,
      getRvvupAcquirerInfo,
      getRvvupPaymentDetails,
      setTransaction,
    };
  };
  
  export default useRvvupDirectPayment;
  