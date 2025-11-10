import { useToast } from "vue-toastification";
import type {
  ShippingMethod,
  EasyShipRates,
  DeliveryMethodListResponse,
  MutationSetShippingMethodArgs,
  DeliveryMethodResponse,
  EasyShipRatesResponse,
  EasyShipRatesArgs,
  MutationEasyShipRatesArgs,
  CartUpdateItemResponse,
  setShippingMethodResponse,
  SetRateCartResponse
} from "~/graphql";
import { useI18n } from '#imports'
import { MutationName } from "~/server/mutations";
import { QueryName } from "~/server/queries";


export const useDeliveryMethod = () => {
  const { $sdk } = useNuxtApp();
  const { t } = useI18n();
  const { cart } = useCart();
  const loading = ref(false);
  const ratesLoading = ref(false)
  const toast = useToast();
  const deliveryMethods = useState<ShippingMethod[]>(
    "delivery-method",
    () => []
  );
  const rates = useState<EasyShipRates[]>(
    "rates",
    () => []
  )

  // Current date and time logic
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentDay = currentDate.getDay();

  const getEstimatedDelivery = (method: ShippingMethod) => {

    const shippingCountry = cart.value?.order?.partnerShipping?.country?.id || 231;

    if (method.name.toLowerCase().includes("click & collect")) {
      // Click & Collect logic
      if (currentDay >= 1 && currentDay <= 5) {
        if (currentHour >= 8 && currentHour < 15) {
          return t("shippingMethod.deliveryTime.hour");
        } else if (currentHour >= 15) {
          return t("shippingMethod.deliveryTime.tomorrow");
        }
      }
      if (currentDay === 5 && currentHour >= 15) {
        return t("shippingMethod.deliveryTime.monday");
      }
      return t("shippingMethod.deliveryTime.hour");
    } else if (method.name.toLowerCase().includes("pallet")) {
      return shippingCountry === 231 // 231 = UK
        ? t("shippingMethod.deliveryTime.palletUk")
        : t("shippingMethod.deliveryTime.palletWorld");
    } else if (method.name.toLowerCase().includes("delivery")) {
      return shippingCountry === 231 // 231 = UK
        ? t("shippingMethod.deliveryTime.standard")
        : t("shippingMethod.deliveryTime.international");
    }
    // Placeholder: Other methods need separate logic
    return t("shippingMethod.deliveryTime.standard");
  };

  const loadDeliveryMethods = async () => {
    loading.value = true;
    try {
      const { data } = await useAsyncData("shipping-methods", async () =>
        await $sdk().odoo.queryNoCache<
          any,
          DeliveryMethodListResponse
        >({
          queryName: QueryName.GetDeliveryMethodsQuery,
        })
      )
      deliveryMethods.value = data.value.deliveryMethods.map(method => ({
        ...method,
        estimatedDelivery: getEstimatedDelivery(method)
      })) || []
    } catch (error: any) {
      toast.error(error?.data?.message)
    } finally {
      loading.value = false;
    }
  };

  const setDeliveryMethod = async (shippingMethodId: number) => {
    try {
      loading.value = true
      const data = await $sdk().odoo.mutation<
        MutationSetShippingMethodArgs,
        DeliveryMethodResponse
      >({ mutationName: MutationName.ShippingMethod }, { shippingMethodId })

      cart.value = data?.setShippingMethod
    } catch (error: any) {
      toast.error(error?.data?.message)
    } finally {
      loading.value = false
    }
  }

  const loadRates = async (params: EasyShipRatesArgs) => {
    ratesLoading.value = true;
    try {
      const data = await $sdk().odoo.queryNoCache<
        EasyShipRatesArgs,
        EasyShipRatesResponse
      >({
        queryName: QueryName.GetEasyShipRatesQuery,
      }, params);

      if (data) {
        rates.value = data.rates || {}
        return true
      }
      return false
    } finally {
      ratesLoading.value = false
    }

  }

  const setRate = async (params: MutationEasyShipRatesArgs) => {
    loading.value = true;

    const data = await $sdk().odoo.mutation<
      MutationEasyShipRatesArgs,
      SetRateCartResponse
    >({ mutationName: MutationName.CartSetEasyship }, params);

    if (!data.setRate) {
      return toast.error(data.message);
    }
    toast.success("Shipping Method updated successfully");
    cart.value = data.setRate
    loading.value = false;
  }

  return {
    loadDeliveryMethods,
    setDeliveryMethod,
    deliveryMethods,
    loadRates,
    setRate,
    loading,
    ratesLoading,
    rates,
  };
};
