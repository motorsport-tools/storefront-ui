<script lang="ts" setup>
import {
  SfCheckbox,
  SfInput,
  SfSelect,
} from "@storefront-ui/vue";
import type { PropType } from "vue";
import {
  AddressEnum,
  type ExpressAddressInput,
  type Country,
  type Partner,
  type State,
} from "~/graphql";

import { useCountryList } from "~/layers/core/composable/useCountryList";

const props = defineProps({
  heading: String,
  description: String,
  type: {
    type: String as PropType<AddressEnum>,
    required: true,
  },
  savedAddress: {
    type: Object as PropType<Partner>,
    default: () => { },
  },
  useBillingForDelivery: {
    type: Boolean,
    default: true
  },
});

/**
 * @TODO extract this form behaviour, undo, commit, validate, etc. to a separate form composable
 */

const { city, country, name, state, street, street2, zip } = toRefs(
  props.savedAddress
);

const { useBillingForDelivery } = toRefs(props)

name.value = name.value === "Public user" ? "" : name.value;

const countryId = toRef(country.value?.id);
const stateId = toRef(state.value?.id);

const { commit: commitCity, undo: undoCity } = useManualRefHistory(city);
const { commit: commitCountry, undo: undoCountry } =
  useManualRefHistory(countryId);
const { commit: commitName, undo: undoName } = useManualRefHistory(name);
const { commit: commitState, undo: undoState } = useManualRefHistory(stateId);
const { commit: commitStreet, undo: undoStreet } = useManualRefHistory(street);
const { commit: commitStreet2, undo: undoStreet2 } = useManualRefHistory(street2);
const { commit: commitZip, undo: undoZip } = useManualRefHistory(zip);
const { commit: commitSame, undo: undoSame } = useManualRefHistory(useBillingForDelivery)

//const { addAddress, updateAddress } = useAddresses();
const { cart, updateCartAddress } = useCart()

const { countries } = useCountryList();

const handleSaveAddress = async () => {
  const data: ExpressAddressInput = {
    name: props.type == AddressEnum.Billing ? cart.value?.order?.partner?.name : name.value || null,
    street: street.value || "",
    street2: street2.value || "",
    city: city.value,
    zip: zip.value,
    countryId: Number(countryId.value),
    stateId: Number(stateId.value),
  };

  
  await updateCartAddress(props.type, data, props.type == AddressEnum.Billing ? useBillingForDelivery.value : false );
  commitAll();
};

const selectedCountry = computed<Country>(
  () =>
    countries.value.countries?.find(
      (item: any) => item.id === countryId.value
    ) || ({} as Country)
);

const selectedState = computed<State>(
  () =>
    selectedCountry.value?.states?.find(
      (item: any) => item.id === stateId.value
    ) || ({} as State)
);

const states = computed(() => selectedCountry.value?.states || []);

const autocompletePrefix = computed(() => props.type == AddressEnum.Billing ? 'billing' : 'shipping')

const commitAll = () => {
  commitCity();
  commitCountry();
  commitState();
  commitStreet();
  commitStreet2();
  commitZip();
  commitSame();
};
</script>

<template>
  Use Billing: {{ useBillingForDelivery }}<br/>
  {{ savedAddress }}<br/>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">
        {{ props.heading }}
      </h2>
    </div>

    <div class="w-full md:max-w-[520px]">
      <p>{{ props.description }}</p>
      
      <form
        class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4"
        data-testid="address-form"
        @submit.prevent="handleSaveAddress"
      >
        <label class="md:col-span-3">
          <UiFormLabel>{{ $t("form.countryLabel") }}</UiFormLabel>
          <SfSelect
            v-model="countryId"
            name="country"
            :autocomplete="autocompletePrefix+' country-name'"
            required
          >
            <option key="placeholder" :value="null">
              {{ $t("form.selectPlaceholder") }}
            </option>
            <option
              v-for="countryOption in countries.countries"
              :key="countryOption?.id"
              :value="countryOption?.id"
            >
              {{ countryOption?.name }}
            </option>
          </SfSelect>
        </label>

        <label
          v-if="type == AddressEnum.Delivery && !useBillingForDelivery"
          class="md:col-span-3"
        >
          <UiFormLabel>{{ $t("form.NameLabel") }}</UiFormLabel>
          <SfInput 
            v-model="name" 
            name="name"
            :autocomplete="autocompletePrefix+' name'"
            required
            :placeholder="$t('form.NameLabel')" />
        </label>

        <label class="md:col-span-3">
          <UiFormLabel>{{ $t("form.streetNameLabel") }}</UiFormLabel>
          <SfInput
            v-model="street"
            name="streetName"
            :autocomplete="autocompletePrefix+' address-line1'"
            required
            :placeholder="$t('form.streetNameLabel')"
          />
        </label>

        <label class="md:col-span-3">
          <UiFormLabel>{{ $t("form.streetNameLabel2") }}</UiFormLabel>
          <SfInput
            v-model="street2"
            name="streetName2"
            :autocomplete="autocompletePrefix+' address-line2'"
            required
            :placeholder="$t('form.streetNameLabel2')"
          />
        </label>

        <label class="md:col-span-3">
          <UiFormLabel>{{ $t("form.cityLabel") }}</UiFormLabel>
          <SfInput
            v-model="city"
            name="city"
            :autocomplete="autocompletePrefix+' address-level2'"
            required
            :placeholder="$t('form.cityLabel')"
          />
        </label>

        <label class="md:col-span-3">
          <UiFormLabel>{{ $t("form.stateLabel") }}</UiFormLabel>
          <SfSelect
            v-model="stateId"
            name="state"
            :autocomplete="autocompletePrefix+' address-level1'"
            :disabled="!states.length"
            :placeholder="$t('form.selectPlaceholder')"
            required
          >
            <option 
              v-for="stateOption in states"
              :key="stateOption.id"
              :value="stateOption.id"
            >
              {{ stateOption.name }}
            </option>
          </SfSelect>
        </label>

        <label>
          <UiFormLabel>{{ $t("form.postalCodeLabel") }}</UiFormLabel>
          <SfInput
            v-model="zip"
            name="postalCode"
            :autocomplete="autocompletePrefix+' postal-code'"
            required
            :placeholder="$t('form.postalCodeLabel')"
            @blur="handleSaveAddress"
          />
        </label>

        <label
          v-if="props.type === AddressEnum.Billing"
          class="md:col-span-3 flex items-center gap-2"
        >
          <SfCheckbox
            v-model="useBillingForDelivery"
            name="useAsShipping" 
          />
          {{ $t("form.useAsShippingLabel") }}
        </label>

      </form>
    </div>
  </div>
</template>
