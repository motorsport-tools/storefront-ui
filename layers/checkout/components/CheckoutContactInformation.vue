<script lang="ts" setup>
import {
  SfInput,
  SfSwitch,
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
const { email, name, phone } = toRefs(props.partnerData);
const { commit: commitEmail, undo: undoEmail } = useManualRefHistory(email);
const { commit: commitName, undo: undoName } = useManualRefHistory(name);
const { commit: commitPhone, undo: undoPhone } = useManualRefHistory(phone);

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
  if(name.value && email.value && phone.value) {
    const data: MutationCreateUpdatePartnerArgs = {
      email: String(email.value),
      name: String(name.value),
      phone: String(phone.value),
      subscribeNewsletter: subscribeNewsletter.value,
    };
    
    await updatePartner(data);

    commitEmail();
    commitName();
    commitPhone();
  }
};

</script>

<template>
  <div data-testid="checkout-contact-info" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">
        {{ props.heading }}
      </h2>
    </div>
    <div
      v-if="isAuthenticated && partnerData?.name && partnerData?.email"
      class="mt-2 md:w-[520px]"
    >
      <p>{{ name }}</p>
      <p>{{ email }}</p>
      <p>{{ phone }}</p>
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
        <div class="mt-4" />
        <UiFormLabel>{{ $t("contactInfo.phone") }}</UiFormLabel>
        <SfInput
            v-model="phone"
            name="phone"
            type="tel"
            placeholder="+44 123 456"
            required
            @blur="handleUpdatePartnerData"
          />
        <div class="mt-4">
          <label>
            <UiFormLabel>{{ $t("contactInfo.subescribe") }}</UiFormLabel>
            <SfSwitch v-model="subscribeNewsletter" @change="handleUpdatePartnerData" />
          </label>
        </div>
      </form>
    </div>
  </div>
</template>
