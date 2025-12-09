<script setup lang="ts">
import { type Partner, type UpdateAddressInput, type AddAddressInput, AddressEnum, type Country, type State, type AddAddressResponse } from "~/graphql"
import { SfInput, SfSwitch, SfSelect, SfCheckbox, SfIconCheckBox } from "@storefront-ui/vue"
import { useCountryList } from "~/layers/core/composable/useCountryList"

const props = defineProps<{
    stepData?: Record<string, any>
    showSummary?: Boolean
    exData?: Partner
    addressType: AddressEnum
}>()

const emit = defineEmits<{
    complete: [data: Record<string, any>]
    update: [data: Record<string, any>]
}>()



const form = reactive({
    id: props.exData?.id || 4,
    name: props.exData?.name && props.exData.name !== 'Public user' ? props.exData.name : '',
    street: props.exData?.street || "",
    street2: props.exData?.street2 || "",
    city: props.exData?.city,
    zip: props.exData?.zip,
    countryId: props.exData?.country?.id || 231,
    stateId: props.exData?.state?.id || null,
    useDelivery: true
})

onMounted(async () => {
    if (props.stepData) {
        Object.assign(form, props.stepData)
    }
})

const { updatePartnerCheckoutAddress } = useAddresses()
const { countries, pending, error } = useCountryList()


const selectedCountry = computed<Country>(
  () =>
    countries.value?.countries?.find(
      (item: any) => item.id === form.countryId
    ) || ({} as Country)
)

const states = computed(() => selectedCountry.value?.states || []);

const selectedState = computed<State>(
  () =>
    selectedCountry.value?.states?.find(
      (item: any) => item.id === form.stateId
    ) || ({} as State)
)

const autocompletePrefix = computed(() => props.addressType == AddressEnum.Billing ? 'billing' : 'shipping')

const handleSubmit = async () => {
    if(form.street && form.city && form.zip && form.countryId) {
        const data = {
            name:  form.name || '',
            street: form.street,
            street2: form.street2,
            city: form.city,
            zip: form.zip,
            countryId: Number(form.countryId),
            stateId: Number(form.stateId),
            useDelivery: Boolean(form?.useDelivery || false)
        };

        if(props.addressType === AddressEnum.Billing) {
            delete data.name
        }

        await updatePartnerCheckoutAddress( { type: props.addressType, address: data })

        emit('complete', { ...form })
        return
    }
}

</script>
<template>
    <div name="summary" v-show="showSummary">
        <div class="mt-2 md:w-[520px]">
            <p v-if="autocompletePrefix == 'shipping'">{{ form.name }}</p>
            <p>{{ form.street }}</p>
            <p v-if="form.street2">{{ form.street2 }}</p>
            <p>{{ form.city }}</p>
            <p v-if="selectedState">{{ selectedState.name }}</p>
            <p>{{ form.zip }}</p>
            <p>{{ selectedCountry.name }}</p>
            <p v-if="form.useDelivery" class="flex flex-row items-center   mt-2"><SfIconCheckBox class="text-green-700" size="sm"/> <strong class="ml-2">{{ $t('form.useAddressForDelivery') }}</strong></p>
        </div>
    </div>
    <div v-show="!showSummary">
        <form 
            data-testid="contact-information-form"
            @submit.prevent="handleSubmit"
            class="space-y-4 md:w-[520px]"
        >

            <label class="md:col-span-3">
                <UiFormLabel>{{ $t("form.countryLabel") }}</UiFormLabel>
                <SfSelect
                    v-model="form.countryId"
                    name="country"
                    :autocomplete="autocompletePrefix+' country-name'"
                    :placeholder="`${$t('form.selectPlaceholder')}`"
                    required
                    :disabled="pending || !!error"
                >
                    <option v-if="pending">
                        {{ $t("form.loadingOptions") }}
                    </option>
                    <option v-if="error" disabled>
                        {{ $t('form.errorOptions') }}
                    </option>
                    <option
                        v-else
                        v-for="countryOption in countries.countries"
                        :key="countryOption?.id"
                        :value="countryOption?.id"
                    >
                        {{ countryOption?.name }}
                    </option>
                </SfSelect>
            </label>
            <div class="mt-4" />

            <label
                v-if="autocompletePrefix == 'shipping'"
                class="md:col-span-3"
            >
                <UiFormLabel>{{ $t("form.NameLabel") }}</UiFormLabel>
                <SfInput 
                    v-model="form.name" 
                    name="name"
                    :autocomplete="autocompletePrefix+' name'"
                    required
                    :placeholder="$t('form.NameLabel')" />
            </label>
            <div v-if="autocompletePrefix == 'shipping'" class="mt-4" />

            <label class="md:col-span-3">
                <UiFormLabel>{{ $t("form.streetNameLabel") }}</UiFormLabel>
                <SfInput
                    v-model="form.street"
                    name="streetName"
                    :autocomplete="autocompletePrefix+' address-line1'"
                    required
                    :placeholder="$t('form.streetNameLabel')"
                />
            </label>
            <div class="mt-4" />

            <label class="md:col-span-3">
                <UiFormLabel>{{ $t("form.streetNameLabel2") }}</UiFormLabel>
                <SfInput
                    v-model="form.street2"
                    name="streetName2"
                    :autocomplete="autocompletePrefix+' address-line2'"
                    :placeholder="$t('form.streetNameLabel2')"
                />
            </label>
            <div class="mt-4" />

            <label class="md:col-span-3">
                <UiFormLabel>{{ $t("form.cityLabel") }}</UiFormLabel>
                <SfInput
                v-model="form.city"
                name="city"
                :autocomplete="autocompletePrefix+' address-level2'"
                required
                :placeholder="$t('form.cityLabel')"
                />
            </label>
            <div class="mt-4" />

            <label class="md:col-span-3">
                <UiFormLabel>{{ $t("form.stateLabel") }}</UiFormLabel>
                <SfSelect
                    v-model="form.stateId"
                    name="state"
                    :autocomplete="autocompletePrefix+' address-level1'"
                    :disabled="!states.length"
                    :placeholder="$t('form.selectPlaceholder')"
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
            <div class="mt-4" />

            <label>
                <UiFormLabel>{{ $t("form.postalCodeLabel") }}</UiFormLabel>
                <SfInput
                    v-model="form.zip"
                    name="postalCode"
                    :autocomplete="autocompletePrefix+' postal-code'"
                    required
                    :placeholder="$t('form.postalCodeLabel')"
                />
            </label>

            <div v-if="autocompletePrefix == 'billing'" class="mt-4" />

            <label
                v-if="autocompletePrefix === 'billing'"
                class="md:col-span-3 flex items-center gap-2"
            >
                <SfCheckbox
                    v-model="form.useDelivery"
                    name="useAsShipping" 
                />
                {{ $t("form.useAsShippingLabel") }}
            </label>

            <button 
                type="submit"
                class="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
                Continue
            </button>
        </form>
    </div>
</template>