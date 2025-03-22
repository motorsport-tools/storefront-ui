<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useDisclosure, SfDropdown, SfButton, SfIconLocationOn, SfModal, SfIconClose, SfInput, SfLoaderCircular } from "@storefront-ui/vue"

const { data: location } = await useAsyncData("location", () => $fetch("/api/location"));

const { isAuthenticated } = useAuth()
const { shippingAddresses } = useAddresses()
const { isOpen, toggle, open, close } = useDisclosure()
const { setPostcode, setDeliveryCountry, loading } = useGeoLocation(location)

watch(location, (newLoc) => {
  console.log("Location updated:", newLoc);
});

const NuxtLink = resolveComponent("NuxtLink");

const emits = defineEmits(["on-postcode", "on-country"]);

const handlePostcodeSubmit = () => {

}

const handleCountrySubmit = () => {

}

const userCountry = ref(213)
const postcode = ref('')
const selectedCountry = ref('')
const selectedAddressId = ref(null) 
</script>

<template>
    <div class="flex justify-center items-stretch flex-nowrap">
        <a 
            @click="toggle()"
            href="#"
            class="inline-flex items-center flex-nowrap whitespace-nowrap"

        >
            <SfIconLocationOn size="base" class="mr-2"/>
            <div class="flex flex-col justify-center items-start leading-none">
                <p class="block text-xs text-neutral-200">Delivering to {{ location.city }} {{ location.postcode }}</p>
            <p class="block text-sm font-bold">{{ location.country }}</p>
            </div>
        </a>
    </div>
    <transition
        enter-active-class="transition duration-200 ease-out"
        leave-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div v-if="isOpen" class="fixed inset-0 bg-neutral-700 bg-opacity-50" />
    </transition>
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
            class="max-w-[90%] md:max-w-lg text-black"
            tag="section"
            role="alertdialog"
            aria-labelledby="deliveryModalTitle"
            aria-describedby="deliveryLocationDesc"
        >
        <header>
            <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
                <SfIconClose />
            </SfButton>
            <h3 id="deliveryModalTitle" class="font-bold typography-headline-4 md:typography-headline-3">
                Choose your location
            </h3>
        </header>
        <div class="flex items-center justify-start flex-col text-gray-500">
            <p id="promoModalDesc" class="text-sm mt-2">
                Delivery options and delivery speeds may vary for different locations
            </p>
            <SfButton 
                class="text-sm mt-4"
                :to="isAuthenticated ? '/my-account/personal-data' : '/login'"
                :tag="NuxtLink"
            >
                Sign in to see your addresses
            </SfButton>
            <Divider fontSize="xs">or enter a UK mainland postcode</Divider>
            <form
                class="flex justify-center w-full gap-4"
                data-testid="address-form"
                @submit.prevent="handlePostcodeSubmit"
            >
            <SfInput
                wrapperClass="grow w-full"
                v-model="postcode"
                name="postalCode"
                autocomplete="postal-code"
                required
                :placeholder="$t('form.postalCodeLabel')"
            />
            <SfButton type="submit" class="min-w-[120px]" :disabled="loading">
                <SfLoaderCircular
                    v-if="loading"
                    class="flex justify-center items-center"
                    size="sm"
                />
                <span v-else>
                    {{ $t("contactInfo.save") }}
                </span>
            </SfButton>

            </form>
            <Divider fontSize="xs">or for delivery outside the UK</Divider>
                <label>
                    <UiFormSelectCountries
                        wrapperClass="grow w-full"
                        v-model="userCountry"
                        @change="handleCountrySubmit" 
                    />
                </label>
        </div>

        </SfModal>
    </transition>
</template>