<script lang="ts" setup>
import {
  SfButton,
  SfInput,
  SfSwitch,
  SfModal,
  useDisclosure,
} from "@storefront-ui/vue";
import type { MutationCreateUpdatePartnerArgs, Partner } from "~/graphql";
const { updatePartner, isAuthenticated } = useAuth();

const props = defineProps({
  heading: {
    type: String,
    required: true,
  },
  partnerData: {
    type: Object as PropType<Partner>,
    required: true,
  },
});

/**
 * @TODO extract this form behaviour, undo, commit, validate, etc. to a separate form composable
 */
const { isOpen, open, close } = useDisclosure();
const { email, name } = toRefs(props.partnerData);
const { commit: commitEmail, undo: undoEmail } = useManualRefHistory(email);
const { commit: commitName, undo: undoName } = useManualRefHistory(name);

watch(
  () => props.partnerData,
  (newPartnerData) => {
    if (newPartnerData.isPublic && newPartnerData.id === 4) {
      name.value = "";
    }
  },
  { immediate: true }
);

const subscribeNewsletter = ref(false);

const handleUpdatePartnerData = async () => {
  if(name.value && email.value) {
    const data: MutationCreateUpdatePartnerArgs = {
      email: String(email.value),
      name: String(name.value),
      subscribeNewsletter: subscribeNewsletter.value,
    };
    
    await updatePartner(data);

    commitEmail();
    commitName();
    close();
  }
};
const handleOpenModal = () => {
  commitEmail();
  commitName();
  open();
};
const handleCancel = () => {
  undoEmail();
  undoName();
  close();
};

</script>

<template>
  <div data-testid="checkout-contact-info" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">
        {{ props.heading }}
      </h2>
      <SfButton
        v-if="isAuthenticated && partnerData?.name && partnerData?.email"
        size="sm"
        variant="tertiary"
        @click="handleOpenModal"
      >
        {{ partnerData.id ? $t("contactInfo.edit") : $t("contactInfo.add") }}
      </SfButton>
    </div>
    <div
      v-if="isAuthenticated && partnerData?.name && partnerData?.email"
      class="mt-2 md:w-[520px]"
    >
      <p>{{ name }}</p>
      <p>{{ email }}</p>
    </div>
    <div v-if="!isAuthenticated" class="mt-2 md:w-[520px]">

      <form
        data-testid="contact-information-form"
        @submit.prevent="handleUpdatePartnerData"
      >

        <label>
          <UiFormLabel>{{ $t("contactInfo.name") }}</UiFormLabel>
          <SfInput
            v-model="name"
            name="name"
            type="text"
            :placeholder="$t('contactInfo.name')"
            required
            @blur="handleUpdatePartnerData"
          />
        </label>
        <div class="mt-4" />
        <label>
          <UiFormLabel>{{ $t("contactInfo.email") }}</UiFormLabel>
          <SfInput
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            :autofocus="!email"
            :placeholder="$t('contactInfo.email')"
            required
            @blur="handleUpdatePartnerData"
          />
        </label>
        <div class="mt-4">
          <label>
            <UiFormLabel>{{ $t("contactInfo.subescribe") }}</UiFormLabel>
            <SfSwitch v-model="subscribeNewsletter" @change="handleUpdatePartnerData" />
          </label>
        </div>
      </form>
    </div>
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
        tag="section"
        role="dialog"
        class="h-full w-full overflow-auto md:w-[600px] md:h-fit z-50"
        aria-labelledby="contact-modal-title"
      >
        <header>
          <SfButton
            square
            variant="tertiary"
            class="absolute right-2 top-2"
            @click="handleCancel"
          >
            <icon
              name="ion:close"
              size="20px"
            />
          </SfButton>
          <h3
            id="contact-modal-title"
            class="text-neutral-900 text-lg md:text-2xl font-bold mb-4"
          >
            {{ $t("contactInfo.heading") }}
          </h3>
        </header>
        <form
          data-testid="contact-information-form"
          @submit.prevent="handleUpdatePartnerData"
        >
          <label>
            <UiFormLabel>{{ $t("contactInfo.name") }}</UiFormLabel>
            <SfInput
              v-model="name"
              name="name"
              type="text"
              :placeholder="$t('contactInfo.name')"
              required
            />
          </label>
          <div class="mt-4" />
          <label>
            <UiFormLabel>{{ $t("contactInfo.email") }}</UiFormLabel>
            <SfInput
              v-model="email"
              name="email"
              type="email"
              :placeholder="$t('contactInfo.email')"
              required
            />
          </label>
          <div class="mt-4">
            <label>
              <UiFormLabel>{{ $t("contactInfo.subescribe") }}</UiFormLabel>
              <SfSwitch v-model="subscribeNewsletter" />
            </label>
          </div>
          <div class="mt-4 flex flex-col-reverse md:flex-row md:justify-end">
            <SfButton
              type="reset"
              class="md:mr-4"
              variant="secondary"
              @click="handleCancel"
            >
              {{ $t("contactInfo.cancel") }}
            </SfButton>
            <SfButton
              type="submit"
              class="min-w-[120px] mb-4 md:mb-0"
            >
              {{ $t("contactInfo.save") }}
            </SfButton>
          </div>
        </form>
      </SfModal>
    </transition>
    <div
      v-if="isOpen"
      class="fixed !w-screen !h-screen inset-0 bg-neutral-500 bg-opacity-50 transition-opacity duration-1000 top-index"
    />
  </div>
</template>
