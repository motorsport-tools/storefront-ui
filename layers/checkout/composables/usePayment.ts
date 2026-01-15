import { useToast } from 'vue-toastification'
import type { PaymentProvider, PaymentMethodListResponse } from "~/graphql";
import { QueryName } from "~/server/queries";

export const usePayment = () => {
  const { $sdk } = useNuxtApp()

  const loading = ref(false)
  const paymentProviders = useState<PaymentProvider[]>(
    "payment-providers",
    () => []
  )
  const toast = useToast()

  const loadPaymentMethods = async (orderId = null) => {
    try {
      loading.value = true;
      const data = await $sdk().odoo.query<any, PaymentMethodListResponse>({
        queryName: QueryName.GetPaymentMethodsQuery,
      }, orderId ? {
        orderId: orderId
      } : {
      })

      paymentProviders.value = data.paymentProviders || [];
    } catch (error: any) {
      toast.error(error?.data?.message)
    } finally {
      loading.value = false
    }
  }

  const getPaymentConfirmation = async (accessToken: string) => {
    try {
      loading.value = true
      const data = await $sdk().odoo.queryNoCache<any, any>({
        queryName: QueryName.GetPaymentConfirmation,
      }, {
        accessToken: accessToken
      })


      return data?.paymentConfirmation;
    } catch (error: any) {
      toast.error(error?.data?.message)
    } finally {
      loading.value = false
    }
  }

  return {
    loadPaymentMethods,
    paymentProviders,
    getPaymentConfirmation,
    loading,
  };
};
