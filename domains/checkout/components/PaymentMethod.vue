<template>
    <div data-testid="checkout-payment" class="md:px-4 py-6">
        <fieldset>
            <legend class="text-neutral-900 text-lg font-bold mb-4">
            {{ $t("checkoutMethod.heading") }}
            </legend>
            <div class="grid gap-4 grid-cols-1">
                <label
                    v-for="method in allPaymentMethods"
                    :key="method.id"
                    class="relative"
                >
                    <input
                        type="radio"
                        name="payment_method"
                        class="peer sr-only"
                        :value="method.id"
                        :checked="selectedMethod && selectedMethod.id === method.id"
                        @change="updateSelectedMethod(method)"
                    />
                    <span
                        class="h-20 flex flex-col items-center justify-center py-4 px-4 cursor-pointer rounded-md border border-neutral-200 -outline-offset-2 hover:border-primary-200 hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 active:border-primary-300 active:bg-primary-200 peer-checked:outline peer-checked:outline-2 peer-checked:outline-primary-700 peer-disabled:opacity-50 peer-disabled:bg-neutral-100 peer-disabled:border-neutral-200 peer-disabled:cursor-not-allowed peer-disabled:[&_img]:grayscale"
                    >
                        <span class="font-medium mt-2">{{ method.name }}</span>
                    </span>
                </label>
            </div>
        </fieldset>
    </div>
</template>

<script setup lang="ts">
import { PaymentMethod } from "~/graphql";

type CheckoutPaymentEmits = (
  event: "update:activePayment",
  parameter: PaymentMethod
) => void;

const props = defineProps({
  activeMethod: {
    type: Object as () => PaymentMethod | null,
    required: false,
    default: () => null, 
  },
  paymentMethods: {
    type: Array as () => PaymentMethod | null,
    required: true,
    default: () => null,
  },
});
const emit = defineEmits<CheckoutPaymentEmits>();

const selectedMethod = ref<PaymentMethod | null>(null);

const allPaymentMethods = computed(() => {
  return props.paymentMethods || [];
});


function updateSelectedMethod(method: PaymentMethod) {
  selectedMethod.value = method;
  emit("update:activePayment", method);
}
</script>