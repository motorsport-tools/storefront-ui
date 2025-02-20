<script setup lang="ts">
import { ref, onMounted } from "vue";
import { SfListItem, SfRadio, SfIconBlock, SfIconLocalShipping, SfIconWarehouse } from "@storefront-ui/vue";

const { cart, loadCart } = useCart();

const { deliveryMethods, loadDeliveryMethods, setDeliveryMethod } =
  useDeliveryMethod();

const radioModel = ref("");

onMounted(async () => {
  await loadDeliveryMethods();
  if (deliveryMethods?.value?.length >= 1) {
    deliveryMethods.value.forEach((val, i) => {
      if (val.id === cart.value?.order?.shippingMethod?.id) {
        radioModel.value = String(val.id);
      }
    })
  }
});

const handleSelectShippingMethod = async (shippingMethodId: number) => {
  radioModel.value = String(shippingMethodId);
  await setDeliveryMethod(shippingMethodId);
  await loadCart(true)
};

const getShippingIcon = (methodName: string) => {
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
    </div>
  </div>
</template>