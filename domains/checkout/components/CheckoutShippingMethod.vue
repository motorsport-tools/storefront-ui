<script setup lang="ts">
import { ref, onMounted } from "vue";
import { SfListItem, SfRadio, SfIconBlock, SfIconLocalShipping, SfIconWarehouse, SfLoaderCircular } from "@storefront-ui/vue";

const { cart, loadCart } = useCart();

const { deliveryMethods, loadDeliveryMethods, setDeliveryMethod, loadRates, setRate, ratesLoading, rates } =
  useDeliveryMethod();

const radioModel = ref("");
const ratesModel = ref("")
const showRates = ref(false)

onMounted(async () => {
  await loadDeliveryMethods();
  if (deliveryMethods?.value?.length >= 1) {
    deliveryMethods.value.forEach((val, i) => {
      if (val.id === cart.value?.order?.shippingMethod?.id) {
        radioModel.value = String(val.id);
        showRates.value = val.name?.toLowerCase().includes("delivery") ? true : false;
      }
    })
    if(showRates.value) {
      await loadRates({ carrierId: radioModel.value, orderId: cart.value?.order?.id })
    }
    ratesModel.value = cart.value?.order?.shippingRate?.serviceId || ''
  }
});

const handleSelectShippingMethod = async (shippingMethodId: number) => {
  radioModel.value = String(shippingMethodId);

  await setDeliveryMethod(shippingMethodId);
  

  deliveryMethods.value.forEach((val, i) => {
    if (val.id === shippingMethodId) {
      showRates.value = val.name?.toLowerCase().includes("delivery") ? true : false;
    }
  })
  if(showRates.value) {
    await loadRates({ carrierId: shippingMethodId, orderId: cart.value?.order?.id })
  }
  
};

const handleSelectRate = async (serviceId: string) => {
  ratesModel.value = String(serviceId);

  await setRate({serviceId})

}

const getShippingIcon = (methodName: String) => {
  if (methodName.toLowerCase().includes("click & collect")) {
    return SfIconWarehouse;
  }
  if (methodName.toLowerCase().includes("delivery") || methodName.toLowerCase().includes("pallet")) {
    return SfIconLocalShipping;
  }
  return null;
};
</script>

<template>
  <div class="md:px-4 my-6" data-testid="shipping-method">
    <div class="flex flex-col justify-between items-start">
      <h3 class="text-neutral-900 text-lg font-bold">
        {{ $t("shippingMethod.heading") }}
      </h3>
      <p class="typography-text-sm text-neutral-600 py-2">{{ $t("shippingMethod.subHeading") }}</p>
    </div>

    <div class="mt-4">
      <ul
        v-if="deliveryMethods.length"
        class="grid gap-y-4 md:grid-cols-2 md:gap-x-4"
        role="radiogroup"
      >
        <SfListItem
          v-for="{ id, name, estimatedDelivery } in deliveryMethods"
          :key="id"
          tag="label"
          class="border rounded-md items-start"
        >
          <div class="flex gap-2 items-center">
            <SfRadio 
              v-model="radioModel" 
              :value="String(id)" 
              @click="handleSelectShippingMethod(id)"
              class="items-center"
            />
            <div class="mr-2">
              <p
                :class="radioModel === String(id) ? 'text-primary-700 font-semibold' : 'text-neutral-600'"
              >{{ name }}</p>
              <p class="text-xs text-neutral-500">{{ $t("shippingMethod.deliveryTime.estimate") }} {{ estimatedDelivery }}</p>
            </div>
            <component
              :is="getShippingIcon(name)"
              class="ml-auto flex items-center"
              :class="radioModel === String(id) ? 'text-primary-700' : 'text-neutral-600'"
              size="lg"
            />
          </div>
        </SfListItem>
      </ul>
      <div v-else class="flex mb-6">
        <SfIconBlock class="mr-2 text-neutral-500" />
        <p>{{ $t("shippingMethod.description") }}</p>
      </div>
      <div class="my-4">
        <div v-if="showRates && ratesLoading" class="w-full text-center">
          <p class="mb-2">Please wait... gathering shipment information</p>
          <SfLoaderCircular size="base" />
        </div>
        <div v-else-if="showRates && !ratesLoading && rates.length > 0">
          <table class="hidden md:block text-left typography-text-sm">
            <caption class="hidden">
              {{ $t("shippingMethod.rates.caption") }}
            </caption>
            <thead class="border-b-2 border-neutral-200">
              <tr>
                <th class="py-4 px-4 font-medium"></th>
                <th></th>
                <th class="py-4 px-4 font-medium">{{ $t("shippingMethod.rates.service") }}</th>
                <th class="py-4 px-4 font-medium text-right">{{ $t("shippingMethod.rates.price") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="rate in rates" 
                :key="rate.serviceId" 
                class="border-b border-neutral-200 last:border-transparent cursor-pointer hover:bg-neutral-100"
                :class="{ 'bg-neutral-200': ratesModel === String(rate.serviceId) }"
                @click="handleSelectRate(rate.serviceId)"
              >
                <td class="py-4 px-4">
                  <SfRadio 
                    v-model="ratesModel" 
                    :value="String(rate.serviceId)" 
                    class="items-center"
                  />
                </td>
                <td class="py-4 px-4">
                  <NuxtImg
                    :src="rate.courierLogoUrl"
                    :alt="rate.courierName"
                    width="90"
                    height="40"
                    class="max-w-none rounded-sm"
                  />
                </td>
                <td class="py-4 px-4 lg:whitespace-nowrap">
                  <p>{{ rate.courierName }}</p>
                  <p class="text-xs text-neutral-500">{{ rate.deliveryDays }}</p>
                </td>
                <td class="p-4 px-4 w-full text-right">{{ $currency(rate.totalCharge) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="showRates && !ratesLoading && rates.length == 0" class="flex mb-6">
          <SfIconBlock class="mr-2 text-neutral-500" />
          <p>{{ $t("shippingMethod.rates.none") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>