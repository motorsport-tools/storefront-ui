<script setup lang="ts">
import {
  SfModal,
  SfButton,
  SfIconClose,
  SfLoaderCircular,
  SfSelect,
  SfIconArrowBack,
  useDisclosure,
} from "@storefront-ui/vue";
import { useToast } from "vue-toastification";
import { useRmaModal } from "../composables/useRmaModal";
import type { Order, OrderLine } from "~/graphql";
import { useRma } from "../composables/useRma";

const props = defineProps<{
  order: Order;
}>();

const emit = defineEmits(["success"]);

const { isOpen, open, close } = useDisclosure({ initialValue: false });
const { modalOverlay } = useRmaModal();

defineExpose({
    open,
    close
})

watch(isOpen, (newVal) => {
    modalOverlay.value = newVal
    if (newVal && rmaOperations.value.length === 0) {
        getRmaOperations();
    }
})

watch(modalOverlay, (newVal) => {
    if (newVal && !isOpen.value) {
        open();
    } else if (!newVal && isOpen.value) {
        close();
    }
})

onUnmounted(() => {
    modalOverlay.value = false
})

const { loading, rmaOperations, getRmaOperations, createRma } = useRma();
const { $i18n } = useNuxtApp();
const toast = useToast();

const selectedItems = ref<Record<number, { qty: number; operationId: number; description: string }>>({});

const eligibleLines = computed(() => {
  return props.order.reportOrderLine?.filter((line) => {
    return line.product && !line.isService && !line.isRewardLine;
  }) || [];
});

const closeModal = () => {
  close();
};

const handleCheckboxChange = (line: OrderLine, checked: boolean) => {
  if (checked) {
    selectedItems.value[line.id] = {
      qty: 1,
      operationId: rmaOperations.value[0]?.id || 0,
      description: "",
    };
  } else {
    delete selectedItems.value[line.id];
  }
};

const handleSubmit = async () => {
  const itemsToReturn = Object.entries(selectedItems.value);
  if (itemsToReturn.length === 0) {
    if (toast) toast.error($i18n.t("rma.error.noItemsSelected"));
    return;
  }

  try {
    for (const [lineId, data] of itemsToReturn) {
        const line = eligibleLines.value.find(l => l.id === parseInt(lineId));
        if (line && line.product) {
            await createRma({
                orderId: props.order.id,
                productId: line.product.id,
                qty: data.qty,
                operationId: data.operationId,
                accessToken: null,
                description: data.description?.trim() || null
            });
        }
    }
    if (toast) toast.success($i18n.t("rma.success.created"));
    emit("success");
    closeModal();
  } catch (error) {
    if (toast) toast.error($i18n.t("rma.error.generic"));
  }
};

const getQtyOptions = (max: number) => {
  const options = [];
  for (let i = 1; i <= max; i++) {
    options.push(i);
  }
  return options;
};
</script>

<template>
  <transition
      enter-active-class="transition duration-200 ease-out"
      leave-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-10"
  >
    <SfModal
      v-model="isOpen"
      class="max-w-[90%] md:max-w-xl z-[110]"
      tag="section"
      role="dialog"
      aria-labelledby="rma-modal-title"
    >
      <header>
        <SfButton
          square
          variant="tertiary"
          class="absolute right-2 top-2"
          @click="closeModal"
        >
          <SfIconClose />
        </SfButton>
        <h3 id="rma-modal-title" class="typography-headline-4 font-bold mb-4">
          {{ $t("rma.modal.title") }} #{{ order.name }}
        </h3>
      </header>

      <div v-if="loading && rmaOperations.length === 0" class="flex justify-center p-8">
        <SfLoaderCircular size="lg" />
      </div>

      <div v-else class="max-h-[70vh] overflow-y-auto">
        <p class="mb-4 text-neutral-600">
          {{ $t("rma.modal.description") }}
        </p>

        <div v-for="line in eligibleLines" :key="line.id" class="border-b py-4 last:border-0">
          <div class="flex items-start gap-4">
            <input
              type="checkbox"
              :id="`line-${line.id}`"
              class="mt-1 w-5 h-5"
              @change="(e) => handleCheckboxChange(line, (e.target as HTMLInputElement).checked)"
            />
            <div class="flex-1">
              <label :for="`line-${line.id}`" class="font-medium block mb-1 cursor-pointer">
                {{ line.product?.name }}
              </label>
              <p class="text-sm text-neutral-500 mb-2">
                SKU: {{ line.product?.sku }} | Ordered: {{ line.quantity }}
              </p>

              <div v-if="selectedItems[line.id]" class="grid grid-cols-2 gap-4 mt-2 slide-down">
                <div>
                  <label class="text-xs font-bold uppercase text-neutral-500 mb-1 block">
                    {{ $t("rma.modal.quantity") }}
                  </label>
                  <SfSelect v-model="(selectedItems[line.id].qty as any)" size="sm">
                    <option v-for="n in getQtyOptions(line.quantity || 1)" :key="n" :value="n">
                      {{ n }}
                    </option>
                  </SfSelect>
                </div>
                <div>
                  <label class="text-xs font-bold uppercase text-neutral-500 mb-1 block">
                    {{ $t("rma.modal.reason") }}
                  </label>
                  <SfSelect v-model="(selectedItems[line.id].operationId as any)" size="sm">
                    <option v-for="op in rmaOperations" :key="op.id" :value="op.id">
                      {{ op.name }}
                    </option>
                  </SfSelect>
                </div>
                <div class="col-span-2 mt-2">
                  <label :for="`desc-${line.id}`" class="text-xs font-bold uppercase text-neutral-500 mb-1 block">
                    {{ $t("rma.modal.additionalInfo") }}
                  </label>
                  <textarea
                    :id="`desc-${line.id}`"
                    v-model="selectedItems[line.id].description"
                    :placeholder="$t('rma.modal.descriptionPlaceholder')"
                    class="w-full border border-neutral-300 rounded-md p-2 text-sm focus:border-primary-700 outline-none transition min-h-[80px]"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="flex justify-end gap-4 mt-6">
        <SfButton variant="secondary" @click="closeModal">
          {{ $t("rma.modal.cancel") }}
        </SfButton>
        <SfButton :disabled="loading || Object.keys(selectedItems).length === 0" @click="handleSubmit">
          <SfLoaderCircular v-if="loading" size="xs" class="mr-2" />
          {{ $t("rma.modal.submit") }}
        </SfButton>
      </footer>
    </SfModal>
  </transition>
</template>

<style scoped>
.slide-down {
  animation: slide-down 0.2s ease-out;
}
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
